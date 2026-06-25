from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.booking import Booking
from app.models.branch import Branch
from app.models.service import Service
from app.models.stylist import Stylist
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingResponse

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.get("/", response_model=list[BookingResponse])
def list_bookings(db: Session = Depends(get_db)):
    return db.query(Booking).order_by(Booking.id.desc()).all()


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    if payload.end_time <= payload.booking_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="end_time must be after booking_date"
        )

    customer = db.query(User).filter(User.id == payload.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    branch = db.query(Branch).filter(Branch.id == payload.branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")

    service = db.query(Service).filter(Service.id == payload.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    stylist = db.query(Stylist).filter(Stylist.id == payload.stylist_id).first()
    if not stylist:
        raise HTTPException(status_code=404, detail="Stylist not found")

    overlapping_booking = (
        db.query(Booking)
        .filter(
            Booking.stylist_id == payload.stylist_id,
            Booking.status.in_(["confirmed", "pending"]),
            Booking.booking_date < payload.end_time,
            Booking.end_time > payload.booking_date,
        )
        .first()
    )

    if overlapping_booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This stylist already has a booking in the selected time range"
        )

    booking = Booking(
        customer_id=payload.customer_id,
        branch_id=payload.branch_id,
        service_id=payload.service_id,
        stylist_id=payload.stylist_id,
        booking_date=payload.booking_date,
        end_time=payload.end_time,
        total_price=payload.total_price,
        notes=payload.notes,
        status="confirmed",
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking