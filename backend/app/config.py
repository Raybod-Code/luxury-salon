from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    # App
    APP_NAME: str = "PANTHEON Luxury Salon"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/pantheon_db"

    # JWT
    SECRET_KEY: str = "change-this-to-a-very-long-random-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24        # 1 day
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # CORS
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://pantheon-salon.com",
    ]

    # Email (SMTP)
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_NAME: str = "PANTHEON Salon"
    EMAILS_FROM_EMAIL: str = "noreply@pantheon-salon.com"

    # SMS (Kavenegar)
    KAVENEGAR_API_KEY: Optional[str] = None
    KAVENEGAR_SENDER: str = "10004346"

    # Storage (S3-compatible)
    S3_ENDPOINT: Optional[str] = None
    S3_ACCESS_KEY: Optional[str] = None
    S3_SECRET_KEY: Optional[str] = None
    S3_BUCKET_NAME: str = "pantheon-media"

    # Payment
    ZARINPAL_MERCHANT_ID: Optional[str] = None
    STRIPE_SECRET_KEY: Optional[str] = None
    PAYMENT_GATEWAY: str = "zarinpal"   # "zarinpal" | "stripe"

    # Booking
    BOOKING_DEPOSIT_PERCENT: int = 30   # 30% پیش‌پرداخت
    CANCEL_DEADLINE_HOURS: int = 24     # کنسلی تا ۲۴ساعت قبل مجاز است
    SLOT_DURATION_MINUTES: int = 30     # کوچکترین واحد زمانی نوبت

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()