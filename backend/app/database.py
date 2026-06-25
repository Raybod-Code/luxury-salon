from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# ساخت موتور اتصال به دیتابیس
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# این تابع در هر ریکوئست، یک نشست (Session) با دیتابیس باز می‌کند و بعد می‌بندد
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()