from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.service import ServiceCategory


class ServiceBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    category: ServiceCategory
    image_url: Optional[str] = None
    price: int
    price_max: Optional[int] = None
    duration_minutes: int = 60
    is_featured: bool = False
    is_signature: bool = False
    is_addon: bool = False
    parent_service_id: Optional[int] = None
    sort_order: int = 0


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    price_max: Optional[int] = None
    duration_minutes: Optional[int] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = None


class ServiceResponse(ServiceBase):
    id: int
    is_active: bool
    created_at: datetime
    addons: List["ServiceResponse"] = []

    model_config = {"from_attributes": True}


ServiceResponse.model_rebuild()