from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class BookingBase(BaseModel):
    customer_id: int
    branch_id: int
    service_id: int
    stylist_id: int
    booking_date: datetime
    end_time: datetime
    total_price: Decimal
    notes: str | None = None


class BookingCreate(BookingBase):
    pass


class BookingResponse(BookingBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)