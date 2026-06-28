from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.service import Service, ServiceCategory
from app.models.user import User
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from app.dependencies.auth import require_admin

router = APIRouter(prefix="/services", tags=["Services"])


@router.get("/", response_model=list[ServiceResponse])
def list_services(
    category: Optional[ServiceCategory] = Query(None),
    featured_only: bool = Query(False),
    db: Session = Depends(get_db),
):
    query = db.query(Service).filter(Service.is_active == True, Service.is_addon == False)
    if category:
        query = query.filter(Service.category == category)
    if featured_only:
        query = query.filter(Service.is_featured == True)
    return query.order_by(Service.sort_order, Service.name).all()


@router.get("/{service_id}", response_model=ServiceResponse)
def get_service(service_id: int, db: Session = Depends(get_db)):
    svc = db.query(Service).filter(Service.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="سرویس یافت نشد")
    return svc


@router.post("/", response_model=ServiceResponse, status_code=201)
def create_service(
    payload: ServiceCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    if db.query(Service).filter(Service.slug == payload.slug).first():
        raise HTTPException(status_code=400, detail="این slug قبلاً استفاده شده")
    svc = Service(**payload.model_dump())
    db.add(svc)
    db.commit()
    db.refresh(svc)
    return svc


@router.put("/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: int,
    payload: ServiceUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    svc = db.query(Service).filter(Service.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="سرویس یافت نشد")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(svc, field, value)
    db.commit()
    db.refresh(svc)
    return svc


@router.delete("/{service_id}", status_code=204)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    svc = db.query(Service).filter(Service.id == service_id).first()
    if not svc:
        raise HTTPException(status_code=404, detail="سرویس یافت نشد")
    svc.is_active = False
    db.commit()