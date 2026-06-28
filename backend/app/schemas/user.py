from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from app.models.user import UserRole, MembershipTier
import re


class UserBase(BaseModel):
    full_name: str
    phone: str
    email: Optional[EmailStr] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        cleaned = re.sub(r"[\s\-()]", "", v)
        if not re.match(r"^(\+98|0098|0)?9\d{9}$", cleaned):
            raise ValueError("شماره موبایل معتبر نیست")
        return cleaned


class UserCreate(UserBase):
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("رمز عبور باید حداقل ۸ کاراکتر باشد")
        return v


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    avatar_url: Optional[str] = None
    beauty_notes: Optional[str] = None
    skin_type: Optional[str] = None
    hair_type: Optional[str] = None
    allergies: Optional[str] = None
    favorite_stylist_id: Optional[int] = None


class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    is_verified: bool
    avatar_url: Optional[str]
    beauty_notes: Optional[str]
    skin_type: Optional[str]
    hair_type: Optional[str]
    membership_tier: MembershipTier
    wallet_balance: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UserPublic(BaseModel):
    id: int
    full_name: str
    avatar_url: Optional[str]

    model_config = {"from_attributes": True}