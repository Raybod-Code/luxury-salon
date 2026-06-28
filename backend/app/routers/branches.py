from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.branch import Branch
from app.models.user import User
from app.schemas.branch import BranchCreate, BranchUpdate, BranchResponse
from app.dependencies.auth import require_admin

router = APIRouter(prefix="/branches", tags=["Branches"])


@router.get("/", response_model=list[BranchResponse])
def list_branches(db: Session = Depends(get_db)):
    return db.query(Branch).filter(Branch.is_active == True).order_by(Branch.is_flagship.desc()).all()


@router.get("/{branch_id}", response_model=BranchResponse)
def get_branch(branch_id: int, db: Session = Depends(get_db)):
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="شعبه یافت نشد")
    return branch


@router.post("/", response_model=BranchResponse, status_code=201)
def create_branch(
    payload: BranchCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    if db.query(Branch).filter(Branch.slug == payload.slug).first():
        raise HTTPException(status_code=400, detail="این slug قبلاً استفاده شده")
    branch = Branch(**payload.model_dump())
    db.add(branch)
    db.commit()
    db.refresh(branch)
    return branch


@router.put("/{branch_id}", response_model=BranchResponse)
def update_branch(
    branch_id: int,
    payload: BranchUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="شعبه یافت نشد")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(branch, field, value)
    db.commit()
    db.refresh(branch)
    return branch


@router.delete("/{branch_id}", status_code=204)
def delete_branch(
    branch_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="شعبه یافت نشد")
    branch.is_active = False
    db.commit()