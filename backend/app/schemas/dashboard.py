from datetime import date

from pydantic import BaseModel


class RecentJob(BaseModel):
    id: int
    job_number: str
    job_name: str
    client_name: str
    assigned_staff_name: str | None
    due_date: date | None
    status: str
    final_cost: float | None


class RecentActivity(BaseModel):
    id: str
    type: str
    title: str
    created_at: str


class TrendPoint(BaseModel):
    label: str
    created: int
    completed: int


class AdminDashboard(BaseModel):
    total_jobs: int
    pending_jobs: int
    jobs_in_progress: int
    completed_jobs: int
    total_clients: int
    active_staff: int
    pending_payments: int
    verified_revenue: float
    recent_jobs: list[RecentJob]
    recent_activity: list[RecentActivity]


class StaffDashboard(BaseModel):
    assigned_jobs: int
    active_jobs: int
    pending_design_reviews: int
    jobs_due_soon: int
    completed_jobs: int
    recent_jobs: list[RecentJob]


class ClientDashboard(BaseModel):
    active_orders: int
    completed_orders: int
    pending_design_approvals: int
    outstanding_payments: float
