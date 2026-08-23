from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class ClientUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    company: str | None = None
    is_active: bool | None = None


class ClientResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str | None = None
    company: str | None = None
    is_active: bool
    active_jobs: int = 0
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
