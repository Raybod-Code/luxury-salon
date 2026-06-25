from datetime import datetime
from pydantic import BaseModel


class BookingCreate(BaseModel):
    branch_id: int
    service_id: int
    stylist_id: int
    booking_date: datetime
    end_time: datetime
    total_price: float
    notes: str | None = None


class BookingStatusUpdate(BaseModel):
    status: str


class BookingResponse(BaseModel):
    id: int
    customer_id: int
    branch_id: int
    service_id: int
    stylist_id: int
    booking_date: datetime
    end_time: datetime
    status: str
    total_price: float
    notes: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}