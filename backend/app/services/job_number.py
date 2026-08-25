import re

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.job import Job

JOB_NUMBER_PATTERN = re.compile(r"^JQ(\d+)$", re.IGNORECASE)


def _highest_job_number(db: Session) -> int:
    """The highest numeric suffix among existing "JQ<n>"-style job numbers,
    defaulting to 100 (so the very first job suggests JQ101). Based on the
    job numbers actually in use rather than the database's internal
    auto-increment id, so deleting a job or renaming one to a custom value
    doesn't throw off what the next suggestion should be."""

    highest = 100

    for (job_number,) in db.query(Job.job_number).all():
        match = JOB_NUMBER_PATTERN.match((job_number or "").strip())
        if match:
            highest = max(highest, int(match.group(1)))

    return highest


def suggest_job_number(db: Session) -> str:
    next_number = _highest_job_number(db) + 1
    candidate = f"JQ{next_number}"

    while db.query(Job).filter(Job.job_number == candidate).first():
        next_number += 1
        candidate = f"JQ{next_number}"

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
