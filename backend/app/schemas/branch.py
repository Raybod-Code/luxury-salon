from datetime import datetime
from pydantic import BaseModel, ConfigDict


class BranchBase(BaseModel):
    name: str
    slug: str
    address: str
    city: str
    phone: str
    email: str | None = None


class BranchCreate(BranchBase):
    pass


class BranchResponse(BranchBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)