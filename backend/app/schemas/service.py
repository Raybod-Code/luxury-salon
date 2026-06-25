from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class ServiceBase(BaseModel):
    name: str
    slug: str
    category: str
    short_description: str | None = None
    description: str | None = None
    duration_minutes: int
    price: Decimal
    is_signature: bool = False


class ServiceCreate(ServiceBase):
    pass


class ServiceResponse(ServiceBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)