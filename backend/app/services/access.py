from fastapi import HTTPException

from app.models.job import Job
from app.models.user import User


def check_job_access(job: Job, current_user: User) -> None:
    if current_user.role == "admin":
        return

    if current_user.role == "staff":
        if job.assigned_staff_id == current_user.id or job.created_by == current_user.id:
            return
        raise HTTPException(status_code=403, detail="You do not have access to this job.")

    if current_user.role == "client":
        if job.client_id == current_user.id:
            return
        raise HTTPException(status_code=403, detail="You do not have access to this job.")

    raise HTTPException(status_code=403, detail="You do not have access to this job.")
