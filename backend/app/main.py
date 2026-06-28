from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
from app.database import engine, Base
from app.config import settings

# Import all models so SQLAlchemy can create tables
from app.models import User, Branch, Service, Stylist, Booking  # noqa: F401

from app.routers import auth, users, branches, services, stylists, bookings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown: cleanup if needed


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API for PANTHEON Luxury Salon",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# Middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(branches.router)
app.include_router(services.router)
app.include_router(stylists.router)
app.include_router(bookings.router)


@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "PANTHEON ONLINE",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/health", tags=["Health"])
def detailed_health():
    return {
        "api": "ok",
        "database": "ok",
    }