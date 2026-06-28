import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime,
    Enum as SAEnum, Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.database import Base


class BookingStatus(str, enum.Enum):
    PENDING = "pending"           # منتظر تأیید پرداخت
    CONFIRMED = "confirmed"       # تأیید شده
    IN_PROGRESS = "in_progress"   # در حال انجام
    COMPLETED = "completed"       # انجام شده
    CANCELLED = "cancelled"       # لغو شده
    NO_SHOW = "no_show"           # نیامده
    RESCHEDULED = "rescheduled"   # تغییر زمان


class PaymentStatus(str, enum.Enum):
    UNPAID = "unpaid"
    DEPOSIT_PAID = "deposit_paid"
    FULLY_PAID = "fully_paid"
    REFUNDED = "refunded"


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_ref = Column(String(20), unique=True, index=True, nullable=False)

    # کلیدهای خارجی
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stylist_id = Column(Integer, ForeignKey("stylists.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=False)

    # سرویس‌های اضافه
    addon_service_ids = Column(JSON, nullable=True)   # [service_id, ...]

    # زمان‌بندی
    scheduled_at = Column(DateTime, nullable=False, index=True)
    duration_minutes = Column(Integer, nullable=False)
    ends_at = Column(DateTime, nullable=False)

    # مالی
    total_price = Column(Integer, nullable=False)     # تومان
    deposit_amount = Column(Integer, default=0)
    discount_amount = Column(Integer, default=0)
    coupon_code = Column(String(50), nullable=True)
    final_price = Column(Integer, nullable=False)

    # وضعیت
    status = Column(SAEnum(BookingStatus), default=BookingStatus.PENDING, nullable=False)
    payment_status = Column(SAEnum(PaymentStatus), default=PaymentStatus.UNPAID, nullable=False)
    payment_ref = Column(String(100), nullable=True)   # شماره پیگیری درگاه

    # یادداشت‌ها
    client_notes = Column(Text, nullable=True)
    staff_notes = Column(Text, nullable=True)

    # تأییدیه
    confirmation_sent = Column(Boolean, default=False)
    reminder_sent = Column(Boolean, default=False)

    # لغو
    cancelled_at = Column(DateTime, nullable=True)
    cancellation_reason = Column(Text, nullable=True)
    cancelled_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    client = relationship("User", back_populates="bookings", foreign_keys=[client_id])
    stylist = relationship("Stylist", back_populates="bookings")
    service = relationship("Service", back_populates="bookings")
    branch = relationship("Branch", back_populates="bookings")

    def __repr__(self):
        return f"<Booking {self.booking_ref} | {self.status}>"