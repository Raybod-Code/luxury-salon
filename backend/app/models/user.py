import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime,
    Enum as SAEnum, Text, ForeignKey
)
from sqlalchemy.orm import relationship
from app.database import Base


class UserRole(str, enum.Enum):
    CLIENT = "client"
    STYLIST = "stylist"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


class MembershipTier(str, enum.Enum):
    STANDARD = "standard"
    SILVER = "silver"
    GOLD = "gold"
    PLATINUM = "platinum"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(180), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.CLIENT, nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    avatar_url = Column(String(500), nullable=True)

    # Beauty Profile
    beauty_notes = Column(Text, nullable=True)
    skin_type = Column(String(50), nullable=True)
    hair_type = Column(String(50), nullable=True)
    allergies = Column(Text, nullable=True)

    # Membership
    membership_tier = Column(
        SAEnum(MembershipTier), default=MembershipTier.STANDARD, nullable=False
    )
    membership_expiry = Column(DateTime, nullable=True)
    wallet_balance = Column(Integer, default=0)  # در تومان

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    # Relationships
    bookings = relationship("Booking", back_populates="client", foreign_keys="Booking.client_id")
    favorite_stylist_id = Column(Integer, ForeignKey("stylists.id"), nullable=True)
    favorite_stylist = relationship("Stylist", foreign_keys=[favorite_stylist_id])

    def __repr__(self):
        return f"<User {self.phone} | {self.role}>"