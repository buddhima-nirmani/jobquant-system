from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class StaffCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    password: str


class StaffUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    is_active: bool | None = None


class StaffResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str | None = None
    is_active: bool
    assigned_jobs: int = 0
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ResetPasswordRequest(BaseModel):
    new_password: str
