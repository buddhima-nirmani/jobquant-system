from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.job import Job


def suggest_job_number(db: Session) -> str:
    last_job = db.query(Job).order_by(Job.id.desc()).first()
    next_id = (last_job.id + 1) if last_job else 1
    candidate = f"JQ{100 + next_id}"

    while db.query(Job).filter(Job.job_number == candidate).first():
        next_id += 1
        candidate = f"JQ{100 + next_id}"

    return candidate


def resolve_job_number(db: Session, requested: str | None) -> str:
    """Use the admin/staff-provided job number if given, otherwise suggest
    the next one. Either way, the result must be unique."""

    if not requested:
        return suggest_job_number(db)

    requested = requested.strip()

    if not requested:
        return suggest_job_number(db)

    if db.query(Job).filter(Job.job_number == requested).first():
        raise HTTPException(
            status_code=400,
            detail=f"Job ID '{requested}' is already in use.",
        )

    return requested
