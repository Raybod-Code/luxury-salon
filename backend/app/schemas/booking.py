from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime
from app.models.booking import BookingStatus, PaymentStatus


class BookingCreate(BaseModel):
    branch_id: int
    service_id: int
    stylist_id: int
    scheduled_at: datetime
    addon_service_ids: Optional[List[int]] = []
    client_notes: Optional[str] = None
    coupon_code: Optional[str] = None

    @field_validator("scheduled_at")
    @classmethod
    def validate_future_date(cls, v: datetime) -> datetime:
        if v <= datetime.utcnow():
            raise ValueError("زمان رزرو باید در آینده باشد")
        return v


class BookingUpdate(BaseModel):
    scheduled_at: Optional[datetime] = None
    client_notes: Optional[str] = None
    status: Optional[BookingStatus] = None
    staff_notes: Optional[str] = None


class BookingCancelRequest(BaseModel):
    reason: Optional[str] = None


class BookingResponse(BaseModel):
    id: int
    booking_ref: str
    client_id: int
    stylist_id: int
    service_id: int
    branch_id: int
    addon_service_ids: Optional[List[int]]
    scheduled_at: datetime
    duration_minutes: int
    ends_at: datetime
    total_price: int
    deposit_amount: int
    discount_amount: int
    final_price: int
    coupon_code: Optional[str]
    status: BookingStatus
    payment_status: PaymentStatus
    payment_ref: Optional[str]
    client_notes: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class AvailableSlot(BaseModel):
    time: str          # "14:30"
    available: bool


class AvailabilityResponse(BaseModel):
    date: str          # "2026-07-01"
    stylist_id: int
    slots: List[AvailableSlot]