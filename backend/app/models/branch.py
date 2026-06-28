from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float
from sqlalchemy.orm import relationship
from app.database import Base


class Branch(Base):
    __tablename__ = "branches"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    slug = Column(String(120), unique=True, index=True, nullable=False)
    address = Column(Text, nullable=False)
    city = Column(String(80), nullable=False, default="تهران")
    phone = Column(String(20), nullable=True)
    whatsapp = Column(String(20), nullable=True)
    instagram = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    cover_image_url = Column(String(500), nullable=True)

    # ساعت کاری — JSON string مثل: {"sat":"09:00-20:00","sun":"09:00-20:00",...}
    working_hours = Column(Text, nullable=True)

    is_active = Column(Boolean, default=True)
    is_flagship = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    stylists = relationship("Stylist", back_populates="branch")
    bookings = relationship("Booking", back_populates="branch")

    def __repr__(self):
        return f"<Branch {self.name}>"