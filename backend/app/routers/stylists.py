from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.stylist import Stylist
from app.schemas.stylist import StylistCreate, StylistResponse
from app.dependencies.auth import get_current_admin
from app.models.user import User

router = APIRouter(prefix="/stylists", tags=["Stylists"])


@router.get("/", response_model=list[StylistResponse])
def list_stylists(db: Session = Depends(get_db)):
    return db.query(Stylist).order_by(Stylist.id.desc()).all()


@router.get("/{stylist_id}", response_model=StylistResponse)
def get_stylist(stylist_id: int, db: Session = Depends(get_db)):
    stylist = db.query(Stylist).filter(Stylist.id == stylist_id).first()
    if not stylist:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stylist not found")
    return stylist


@router.post("/", response_model=StylistResponse, status_code=status.HTTP_201_CREATED)
def create_stylist(
    payload: StylistCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin),
):
    stylist = Stylist(**payload.model_dump())
    db.add(stylist)
    db.commit()
    db.refresh(stylist)
    return stylist