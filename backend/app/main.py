from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import User, Branch, Service, Stylist, Booking
from app.routers import services, stylists, branches, bookings
from app.routers import users
from app.routers import auth



Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Luxury Salon API",
    version="1.0.0",
    description="Backend for Luxury Salon MVP"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(branches.router)
app.include_router(services.router)
app.include_router(stylists.router)
app.include_router(bookings.router)
app.include_router(auth.router) 


@app.get("/")
def read_root():
    return {"status": "NEXUS-OMEGA ONLINE", "message": "Backend is running smoothly!"}