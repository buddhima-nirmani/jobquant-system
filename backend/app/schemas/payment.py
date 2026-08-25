from datetime import datetime

from pydantic import BaseModel, Field


class PaymentCreate(BaseModel):
    amount: float = Field(gt=0)
    payment_method: str | None = None


class PaymentResponse(BaseModel):
    id: int
    job_id: int
    job_number: str
    client_id: int
    client_name: str
    uploaded_by: int
    uploaded_by_name: str
    amount: float
    payment_method: str | None
    status: str
    rejection_reason: str | None
    verified_by: int | None
    verified_at: datetime | None
    created_at: datetime
    has_slip: bool
    outstanding_amount: float | None


class PaymentRejectRequest(BaseModel):
    reason: str
