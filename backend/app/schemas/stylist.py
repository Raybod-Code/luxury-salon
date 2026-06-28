from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.stylist import StylistLevel


class StylistBase(BaseModel):
    display_name: str
    title: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    portfolio_images: Optional[List[str]] = None
    level: StylistLevel = StylistLevel.MID
    experience_years: int = 1
    specialties: Optional[List[str]] = None
    languages: Optional[List[str]] = ["fa"]
    work_days: Optional[List[str]] = None
    work_start: str = "09:00"
    work_end: str = "20:00"
    break_start: Optional[str] = None
    break_end: Optional[str] = None
    accepts_new_clients: bool = True
    sort_order: int = 0


class StylistCreate(StylistBase):
    user_id: int
    branch_id: int


class StylistUpdate(BaseModel):
    display_name: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    portfolio_images: Optional[List[str]] = None
    specialties: Optional[List[str]] = None
    work_days: Optional[List[str]] = None
    work_start: Optional[str] = None
    work_end: Optional[str] = None
    is_active: Optional[bool] = None
    accepts_new_clients: Optional[bool] = None
    branch_id: Optional[int] = None


class StylistResponse(StylistBase):
    id: int
    user_id: int
    branch_id: int
    rating: float
    review_count: int
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}