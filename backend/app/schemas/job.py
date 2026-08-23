from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.constants import JOB_PRIORITIES, JOB_STATUSES


class PersonSummary(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str | None = None
    company: str | None = None

    model_config = ConfigDict(from_attributes=True)


class JobItemCreate(BaseModel):
    product_category: str
    product_name: str
    width: float = Field(gt=0)
    height: float = Field(gt=0)
    area: float = Field(gt=0)
    unit: str
    quantity: int = Field(gt=0)
    material: str
    specification: str
    print_type: str
    lamination: str
    installation: str
    predicted_cost: float | None = None


class JobItemResponse(JobItemCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


class JobCreate(BaseModel):
    job_number: str | None = None
    job_name: str
    description: str | None = None
    job_type: str | None = None

    client_id: int
    assigned_staff_id: int | None = None

    order_date: date
    due_date: date | None = None
    priority: str = "Medium"

    transportation_required: bool = False
    transport_distance: float | None = None

    predicted_cost: float | None = None
    final_cost: float = Field(ge=0)

    notes: str | None = None

    items: list[JobItemCreate]

    @field_validator("items")
    @classmethod
    def items_not_empty(cls, value: list[JobItemCreate]) -> list[JobItemCreate]:
        if not value:
            raise ValueError("At least one order item is required.")
        return value

    @field_validator("priority")
    @classmethod
    def valid_priority(cls, value: str) -> str:
        if value not in JOB_PRIORITIES:
            raise ValueError(f"Priority must be one of {JOB_PRIORITIES}.")
        return value


class JobUpdate(BaseModel):
    job_number: str | None = None
    job_name: str | None = None
    description: str | None = None
    job_type: str | None = None
    assigned_staff_id: int | None = None
    due_date: date | None = None
    priority: str | None = None
    final_cost: float | None = None
    notes: str | None = None


class JobStatusUpdate(BaseModel):
    status: str
    note: str | None = None

    @field_validator("status")
    @classmethod
    def valid_status(cls, value: str) -> str:
        if value not in JOB_STATUSES:
            raise ValueError(f"Status must be one of {JOB_STATUSES}.")
        return value


class JobProgressResponse(BaseModel):
    id: int
    status: str
    note: str | None
    updated_by: int
    updated_by_name: str
    created_at: datetime


class JobListItem(BaseModel):
    id: int
    job_number: str
    job_name: str
    client_name: str
    assigned_staff_name: str | None
    order_date: date
    due_date: date | None
    final_cost: float | None
    predicted_cost: float | None
    paid_amount: float
    outstanding_amount: float | None
    status: str
    priority: str


class JobDetail(BaseModel):
    id: int
    job_number: str
    job_name: str
    description: str | None
    job_type: str | None
    status: str
    priority: str

    client: PersonSummary
    assigned_staff: PersonSummary | None
    created_by: PersonSummary

    order_date: date
    due_date: date | None

    transportation_required: bool
    transport_distance: float | None

    predicted_cost: float | None
    final_cost: float | None

    notes: str | None

    items: list[JobItemResponse]
    progress_history: list[JobProgressResponse]

    paid_amount: float
    outstanding_amount: float | None

    created_at: datetime
    updated_at: datetime | None
