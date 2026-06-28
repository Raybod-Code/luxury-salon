from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.stylist import Stylist
from app.models.user import User
from app.schemas.stylist import StylistCreate, StylistUpdate, StylistResponse
from app.dependencies.auth import require_admin

router = APIRouter(prefix="/stylists", tags=["Stylists"])


@router.get("/", response_model=list[StylistResponse])
def list_stylists(
    branch_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Stylist).filter(Stylist.is_active == True)
    if branch_id:
        query = query.filter(Stylist.branch_id == branch_id)
    return query.order_by(Stylist.sort_order, Stylist.display_name).all()


@router.get("/{stylist_id}", response_model=StylistResponse)
def get_stylist(stylist_id: int, db: Session = Depends(get_db)):
    stylist = db.query(Stylist).filter(Stylist.id == stylist_id).first()
    if not stylist:
        raise HTTPException(status_code=404, detail="استایلیست یافت نشد")
    return stylist


@router.post("/", response_model=StylistResponse, status_code=201)
def create_stylist(
    payload: StylistCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    stylist = Stylist(**payload.model_dump())
    db.add(stylist)
    db.commit()
    db.refresh(stylist)
    return stylist


@router.put("/{stylist_id}", response_model=StylistResponse)
def update_stylist(
    stylist_id: int,
    payload: StylistUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    stylist = db.query(Stylist).filter(Stylist.id == stylist_id).first()
    if not stylist:
        raise HTTPException(status_code=404, detail="استایلیست یافت نشد")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(stylist, field, value)
    db.commit()
    db.refresh(stylist)
    return stylist