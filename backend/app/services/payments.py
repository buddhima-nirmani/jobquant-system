from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.job import Job
from app.models.payment import Payment


def paid_amount(db: Session, job_id: int) -> float:
    return (
        db.query(func.coalesce(func.sum(Payment.amount), 0.0))
        .filter(Payment.job_id == job_id, Payment.status == "Verified")
        .scalar()
        or 0.0
    )


def is_fully_paid(db: Session, job: Job) -> bool:
    if job.final_cost is None or job.final_cost <= 0:
        return False

    return paid_amount(db, job.id) >= job.final_cost
