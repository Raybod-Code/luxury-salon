import random
import string
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.models.service import Service
from app.models.stylist import Stylist
from app.models.user import User
from app.schemas.booking import (
    BookingCreate, BookingUpdate, BookingResponse,
    BookingCancelRequest, AvailabilityResponse, AvailableSlot
)
from app.dependencies.auth import get_current_active_user, require_admin
from app.config import settings

router = APIRouter(prefix="/bookings", tags=["Bookings"])


def _generate_ref() -> str:
    return "PNT-" + "".join(random.choices(string.ascii_uppercase + string.digits, k=8))


def _get_available_slots(
    db: Session,
    stylist: Stylist,
    date: datetime,
    service_duration: int,
) -> list[AvailableSlot]:
    """محاسبه اسلات‌های خالی یک استایلیست در یک روز."""
    work_start_h, work_start_m = map(int, stylist.work_start.split(":"))
    work_end_h, work_end_m = map(int, stylist.work_end.split(":"))

    day_start = date.replace(hour=work_start_h, minute=work_start_m, second=0, microsecond=0)
    day_end = date.replace(hour=work_end_h, minute=work_end_m, second=0, microsecond=0)

    # رزروهای موجود آن روز
    existing = (
        db.query(Booking)
        .filter(
            Booking.stylist_id == stylist.id,
            Booking.scheduled_at >= day_start,
            Booking.scheduled_at < day_end + timedelta(hours=1),
            Booking.status.notin_([BookingStatus.CANCELLED, BookingStatus.NO_SHOW]),
        )
        .all()
    )

    busy_periods = [(b.scheduled_at, b.ends_at) for b in existing]

    slots = []
    cursor = day_start
    slot_step = timedelta(minutes=settings.SLOT_DURATION_MINUTES)
    needed = timedelta(minutes=service_duration)

    while cursor + needed <= day_end:
        slot_end = cursor + needed
        is_free = all(
            slot_end <= busy_start or cursor >= busy_end
            for busy_start, busy_end in busy_periods
        )
        slots.append(AvailableSlot(time=cursor.strftime("%H:%M"), available=is_free))
        cursor += slot_step

    return slots


@router.get("/availability", response_model=AvailabilityResponse)
def check_availability(
    stylist_id: int = Query(...),
    service_id: int = Query(...),
    date: str = Query(..., description="YYYY-MM-DD"),
    db: Session = Depends(get_db),
):
    stylist = db.query(Stylist).filter(Stylist.id == stylist_id, Stylist.is_active == True).first()
    if not stylist:
        raise HTTPException(status_code=404, detail="استایلیست یافت نشد")

    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="سرویس یافت نشد")

    try:
        target_date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="فرمت تاریخ اشتباه است (YYYY-MM-DD)")

    slots = _get_available_slots(db, stylist, target_date, service.duration_minutes)
    return AvailabilityResponse(date=date, stylist_id=stylist_id, slots=slots)


@router.post("/", response_model=BookingResponse, status_code=201)
def create_booking(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    service = db.query(Service).filter(Service.id == payload.service_id, Service.is_active == True).first()
    if not service:
        raise HTTPException(status_code=404, detail="سرویس یافت نشد")

    stylist = db.query(Stylist).filter(Stylist.id == payload.stylist_id, Stylist.is_active == True).first()
    if not stylist:
        raise HTTPException(status_code=404, detail="استایلیست یافت نشد")

    ends_at = payload.scheduled_at + timedelta(minutes=service.duration_minutes)

    # بررسی تداخل
    conflict = (
        db.query(Booking)
        .filter(
            Booking.stylist_id == payload.stylist_id,
            Booking.status.notin_([BookingStatus.CANCELLED, BookingStatus.NO_SHOW]),
            Booking.scheduled_at < ends_at,
            Booking.ends_at > payload.scheduled_at,
        )
        .first()
    )
    if conflict:
        raise HTTPException(status_code=409, detail="این زمان قبلاً رزرو شده است")

    # محاسبه قیمت
    total_price = service.price
    addon_ids = payload.addon_service_ids or []
    for addon_id in addon_ids:
        addon = db.query(Service).filter(Service.id == addon_id, Service.is_addon == True).first()
        if addon:
            total_price += addon.price

    deposit = int(total_price * settings.BOOKING_DEPOSIT_PERCENT / 100)

    booking = Booking(
        booking_ref=_generate_ref(),
        client_id=current_user.id,
        stylist_id=payload.stylist_id,
        service_id=payload.service_id,
        branch_id=payload.branch_id,
        addon_service_ids=addon_ids,
        scheduled_at=payload.scheduled_at,
        duration_minutes=service.duration_minutes,
        ends_at=ends_at,
        total_price=total_price,
        deposit_amount=deposit,
        discount_amount=0,
        final_price=total_price,
        client_notes=payload.client_notes,
        coupon_code=payload.coupon_code,
        status=BookingStatus.PENDING,
        payment_status=PaymentStatus.UNPAID,
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/my", response_model=list[BookingResponse])
def my_bookings(
    status: Optional[BookingStatus] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    query = db.query(Booking).filter(Booking.client_id == current_user.id)
    if status:
        query = query.filter(Booking.status == status)
    return query.order_by(Booking.scheduled_at.desc()).all()


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="رزرو یافت نشد")
    if booking.client_id != current_user.id and current_user.role.value not in ("admin", "super_admin"):
        raise HTTPException(status_code=403, detail="دسترسی مجاز نیست")
    return booking


@router.patch("/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking(
    booking_id: int,
    payload: BookingCancelRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="رزرو یافت نشد")
    if booking.client_id != current_user.id:
        raise HTTPException(status_code=403, detail="دسترسی مجاز نیست")
    if booking.status in (BookingStatus.CANCELLED, BookingStatus.COMPLETED):
        raise HTTPException(status_code=400, detail="این رزرو قابل لغو نیست")

    deadline = booking.scheduled_at - timedelta(hours=settings.CANCEL_DEADLINE_HOURS)
    if datetime.utcnow() > deadline:
        raise HTTPException(
            status_code=400,
            detail=f"لغو رزرو تا {settings.CANCEL_DEADLINE_HOURS} ساعت قبل از نوبت امکان‌پذیر است",
        )

    booking.status = BookingStatus.CANCELLED
    booking.cancelled_at = datetime.utcnow()
    booking.cancellation_reason = payload.reason
    booking.cancelled_by_id = current_user.id
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/admin/all", response_model=list[BookingResponse])
def admin_list_bookings(
    skip: int = 0,
    limit: int = 50,
    status: Optional[BookingStatus] = Query(None),
    branch_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    query = db.query(Booking)
    if status:
        query = query.filter(Booking.status == status)
    if branch_id:
        query = query.filter(Booking.branch_id == branch_id)
    return query.order_by(Booking.scheduled_at.desc()).offset(skip).limit(limit).all()


@router.patch("/admin/{booking_id}/confirm", response_model=BookingResponse)
def confirm_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="رزرو یافت نشد")
    booking.status = BookingStatus.CONFIRMED
    db.commit()
    db.refresh(booking)
    return booking