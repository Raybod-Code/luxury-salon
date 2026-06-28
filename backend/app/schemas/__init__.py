from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserPublic
from app.schemas.auth import LoginRequest, TokenResponse, OTPRequest, OTPVerify
from app.schemas.branch import BranchCreate, BranchUpdate, BranchResponse
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from app.schemas.stylist import StylistCreate, StylistUpdate, StylistResponse
from app.schemas.booking import (
    BookingCreate, BookingUpdate, BookingResponse,
    BookingCancelRequest, AvailabilityResponse
)