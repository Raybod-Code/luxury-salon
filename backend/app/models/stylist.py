import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime,
    Enum as SAEnum, Text, Float, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.database import Base


class StylistLevel(str, enum.Enum):
    JUNIOR = "junior"
    MID = "mid"
    SENIOR = "senior"
    MASTER = "master"
    CREATIVE_DIRECTOR = "creative_director"


class Stylist(Base):
    __tablename__ = "stylists"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=False)

    display_name = Column(String(120), nullable=False)
    title = Column(String(120), nullable=True)           # مثلاً "Senior Hair Artist"
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    portfolio_images = Column(JSON, nullable=True)       # list of URLs

    level = Column(SAEnum(StylistLevel), default=StylistLevel.MID, nullable=False)
    experience_years = Column(Integer, default=1)
    specialties = Column(JSON, nullable=True)            # ["balayage","keratin",...]
    languages = Column(JSON, nullable=True)              # ["fa","en"]

    rating = Column(Float, default=5.0)
    review_count = Column(Integer, default=0)

    # تقویم
    work_days = Column(JSON, nullable=True)    # ["sat","sun","mon",...]
    work_start = Column(String(5), default="09:00")
    work_end = Column(String(5), default="20:00")
    break_start = Column(String(5), nullable=True)
    break_end = Column(String(5), nullable=True)

    is_active = Column(Boolean, default=True)
    accepts_new_clients = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    branch = relationship("Branch", back_populates="stylists")
    bookings = relationship("Booking", back_populates="stylist")

    def __repr__(self):
        return f"<Stylist {self.display_name} | {self.level}>"