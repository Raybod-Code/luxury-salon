from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class StylistBase(BaseModel):
    branch_id: int
    first_name: str
    last_name: str
    slug: str
    title: str
    bio: str | None = None
    specialties: str | None = None
    years_of_experience: int | None = None
    image_url: str | None = None
    rating: Decimal | None = None


class StylistCreate(StylistBase):
    pass


class StylistResponse(StylistBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)