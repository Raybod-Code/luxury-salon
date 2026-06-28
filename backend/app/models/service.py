import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime,
    Enum as SAEnum, Text, Float, ForeignKey
)
from sqlalchemy.orm import relationship
from app.database import Base


class ServiceCategory(str, enum.Enum):
    HAIR = "hair"
    SKIN = "skin"
    NAIL = "nail"
    MAKEUP = "makeup"
    BROW = "brow"
    LASH = "lash"
    BRIDAL = "bridal"
    MASSAGE = "massage"
    PACKAGE = "package"


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    slug = Column(String(150), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    short_description = Column(String(300), nullable=True)
    category = Column(SAEnum(ServiceCategory), nullable=False)
    image_url = Column(String(500), nullable=True)

    # قیمت و زمان
    price = Column(Integer, nullable=False)               # تومان
    price_max = Column(Integer, nullable=True)            # برای رنج قیمتی
    duration_minutes = Column(Integer, nullable=False, default=60)

    # نمایش
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    is_signature = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)

    # سرویس مکمل (add-on)
    is_addon = Column(Boolean, default=False)
    parent_service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    addons = relationship("Service", foreign_keys=[parent_service_id])

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    bookings = relationship("Booking", back_populates="service")

    def __repr__(self):
        return f"<Service {self.name} | {self.category}>"