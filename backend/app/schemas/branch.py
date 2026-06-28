from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BranchBase(BaseModel):
    name: str
    slug: str
    address: str
    city: str = "تهران"
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    instagram: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    cover_image_url: Optional[str] = None
    working_hours: Optional[str] = None
    is_flagship: bool = False


class BranchCreate(BranchBase):
    pass


class BranchUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    working_hours: Optional[str] = None
    cover_image_url: Optional[str] = None
    is_active: Optional[bool] = None


class BranchResponse(BranchBase):
    id: int
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}