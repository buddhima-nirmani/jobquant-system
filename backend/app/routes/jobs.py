from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.constants import JOB_STATUSES
from app.database import get_db
from app.dependencies import get_current_user, require_admin, require_staff_or_admin
from app.models.job import Job
from app.models.job_item import JobItem
from app.models.job_progress import JobProgress
from app.models.user import User
from app.schemas.job import (
    JobCreate,
    JobDetail,
    JobItemCreate,
    JobItemResponse,
    JobListItem,
    JobProgressResponse,
    JobStatusUpdate,
    JobUpdate,
    PersonSummary,
)
from app.services.access import check_job_access
from app.services.job_number import resolve_job_number, suggest_job_number
from app.services.notifications import notify
from app.services.payments import paid_amount as _paid_amount_service

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])


def _get_job_or_404(job_id: int, db: Session) -> Job:
    job = (
        db.query(Job)
        .options(
            joinedload(Job.client),
            joinedload(Job.assigned_staff),
            joinedload(Job.creator),
            joinedload(Job.items),
            joinedload(Job.progress_history).joinedload(JobProgress.updated_by_user),
        )
        .filter(Job.id == job_id)
        .first()
    )

    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    return job


def _to_item_response(item: JobItem, hide_predicted: bool) -> JobItemResponse:
    response = JobItemResponse.model_validate(item)
    if hide_predicted:
        response.predicted_cost = None
    return response


def _to_detail(job: Job, db: Session, current_user: User) -> JobDetail:
    paid = _paid_amount_service(db, job.id)
    hide_predicted = current_user.role == "client"

    return JobDetail(
        id=job.id,
        job_number=job.job_number,
        job_name=job.job_name,
        description=job.description,
        job_type=job.job_type,
        status=job.status,
        priority=job.priority,
        client=PersonSummary.model_validate(job.client),
        assigned_staff=(
            PersonSummary.model_validate(job.assigned_staff)
            if job.assigned_staff
            else None
        ),
        created_by=PersonSummary.model_validate(job.creator),
        order_date=job.order_date,
        due_date=job.due_date,
        transportation_required=job.transportation_required,
        transport_distance=job.transport_distance,
        predicted_cost=None if hide_predicted else job.predicted_cost,
        final_cost=job.final_cost,
        notes=job.notes,
        items=[_to_item_response(item, hide_predicted) for item in job.items],
        progress_history=[
            JobProgressResponse(
                id=entry.id,
                status=entry.status,
                note=entry.note,
                updated_by=entry.updated_by,
                updated_by_name=entry.updated_by_user.name,
                created_at=entry.created_at,
            )
            for entry in job.progress_history
        ],
        paid_amount=paid,
        outstanding_amount=(
            None if job.final_cost is None else round(job.final_cost - paid, 2)
        ),
        created_at=job.created_at,
        updated_at=job.updated_at,
    )


@router.get("/next-number")
def get_next_job_number(
    db: Session = Depends(get_db),
    _=Depends(require_staff_or_admin),
):
    return {"job_number": suggest_job_number(db)}


@router.post("", response_model=JobDetail, status_code=201)
def create_job(
    payload: JobCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    client = (
        db.query(User)
        .filter(User.id == payload.client_id, User.role == "client")
        .first()
    )
    if not client:
        raise HTTPException(status_code=400, detail="Selected client was not found.")

    if payload.assigned_staff_id is not None:
        staff_member = (
            db.query(User)
            .filter(User.id == payload.assigned_staff_id, User.role == "staff")
            .first()
        )
        if not staff_member:
            raise HTTPException(
                status_code=400, detail="Selected staff member was not found."
            )

    if payload.transportation_required and not payload.transport_distance:
        raise HTTPException(
            status_code=400,
            detail="Transport distance is required when transportation is enabled.",
        )

    job = Job(
        job_number=resolve_job_number(db, payload.job_number),
        job_name=payload.job_name,
        description=payload.description,
        job_type=payload.job_type,
        client_id=payload.client_id,
        assigned_staff_id=payload.assigned_staff_id,
        created_by=current_user.id,
        order_date=payload.order_date,
        due_date=payload.due_date,
        priority=payload.priority,
        status="Pending",
        transportation_required=payload.transportation_required,
        transport_distance=payload.transport_distance,
        predicted_cost=payload.predicted_cost,
        final_cost=payload.final_cost,
        notes=payload.notes,
    )

    db.add(job)
    db.flush()

    for item in payload.items:
        db.add(JobItem(job_id=job.id, **item.model_dump()))

    db.add(
        JobProgress(
            job_id=job.id,
            status="Pending",
            note="Job created.",
            updated_by=current_user.id,
        )
    )

    if payload.assigned_staff_id:
        notify(
            db,
            payload.assigned_staff_id,
            "job",
            f"You were assigned to {job.job_number} - {job.job_name}",
            link=f"/staff/jobs/{job.id}",
        )

    db.commit()

    return _to_detail(_get_job_or_404(job.id, db), db, current_user)


@router.get("", response_model=list[JobListItem])
def list_jobs(
    q: str | None = None,
    status_filter: str | None = Query(default=None, alias="status"),
    priority: str | None = None,
    staff_id: int | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Job).options(
        joinedload(Job.client), joinedload(Job.assigned_staff)
    )

    if current_user.role == "client":
        query = query.filter(Job.client_id == current_user.id)
    elif current_user.role == "staff":
        query = query.filter(
            or_(
                Job.assigned_staff_id == current_user.id,
                Job.created_by == current_user.id,
            )
        )

    if q:
        like = f"%{q}%"
        query = query.join(Job.client).filter(
            or_(
                Job.job_number.ilike(like),
                Job.job_name.ilike(like),
                User.name.ilike(like),
            )
        )

    if status_filter:
        query = query.filter(Job.status == status_filter)

    if priority:
        query = query.filter(Job.priority == priority)

    if staff_id:
        query = query.filter(Job.assigned_staff_id == staff_id)

    if date_from:
        query = query.filter(Job.order_date >= date_from)

    if date_to:
        query = query.filter(Job.order_date <= date_to)

    jobs = query.order_by(Job.created_at.desc()).all()

    hide_predicted = current_user.role == "client"

    results = []
    for job in jobs:
        paid = _paid_amount_service(db, job.id)
        results.append(
            JobListItem(
                id=job.id,
                job_number=job.job_number,
                job_name=job.job_name,
                client_name=job.client.name,
                assigned_staff_name=(
                    job.assigned_staff.name if job.assigned_staff else None
                ),
                order_date=job.order_date,
                due_date=job.due_date,
                final_cost=job.final_cost,
                predicted_cost=None if hide_predicted else job.predicted_cost,
                paid_amount=paid,
                outstanding_amount=(
                    None if job.final_cost is None else round(job.final_cost - paid, 2)
                ),
                status=job.status,
                priority=job.priority,
            )
        )

    return results


@router.get("/{job_id}", response_model=JobDetail)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = _get_job_or_404(job_id, db)
    check_job_access(job, current_user)

    return _to_detail(job, db, current_user)


@router.put("/{job_id}", response_model=JobDetail)
def update_job(
    job_id: int,
    payload: JobUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    job = _get_job_or_404(job_id, db)
    check_job_access(job, current_user)

    updates = payload.model_dump(exclude_unset=True)

    if "job_number" in updates:
        new_number = (updates["job_number"] or "").strip()
        if not new_number:
            raise HTTPException(status_code=400, detail="Job ID cannot be empty.")
        if new_number != job.job_number and (
            db.query(Job).filter(Job.job_number == new_number).first()
        ):
            raise HTTPException(
                status_code=400, detail=f"Job ID '{new_number}' is already in use."
            )
        updates["job_number"] = new_number

    if "assigned_staff_id" in updates and updates["assigned_staff_id"] is not None:
        staff_member = (
            db.query(User)
            .filter(User.id == updates["assigned_staff_id"], User.role == "staff")
            .first()
        )
        if not staff_member:
            raise HTTPException(
                status_code=400, detail="Selected staff member was not found."
            )

    new_staff_id = updates.get("assigned_staff_id")
    staff_changed = "assigned_staff_id" in updates and new_staff_id != job.assigned_staff_id

    for field, value in updates.items():
        setattr(job, field, value)

    db.add(job)

    if staff_changed and new_staff_id:
        notify(
            db,
            new_staff_id,
            "job",
            f"You were assigned to {job.job_number} - {job.job_name}",
            link=f"/staff/jobs/{job.id}",
        )

    db.commit()

    return _to_detail(_get_job_or_404(job.id, db), db, current_user)


@router.put("/{job_id}/items", response_model=JobDetail)
def update_job_items(
    job_id: int,
    payload: list[JobItemCreate],
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    job = _get_job_or_404(job_id, db)
    check_job_access(job, current_user)

    if not payload:
        raise HTTPException(
            status_code=400, detail="At least one order item is required."
        )

    db.query(JobItem).filter(JobItem.job_id == job_id).delete()

    for item in payload:
        db.add(JobItem(job_id=job_id, **item.model_dump()))

    db.commit()

    return _to_detail(_get_job_or_404(job.id, db), db, current_user)


@router.delete("/{job_id}")
def delete_job(
    job_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    job = _get_job_or_404(job_id, db)
    db.delete(job)
    db.commit()

    return {"message": "Job deleted successfully."}


@router.get("/{job_id}/progress", response_model=list[JobProgressResponse])
def get_job_progress(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = _get_job_or_404(job_id, db)
    check_job_access(job, current_user)

    return [
        JobProgressResponse(
            id=entry.id,
            status=entry.status,
            note=entry.note,
            updated_by=entry.updated_by,
            updated_by_name=entry.updated_by_user.name,
            created_at=entry.created_at,
        )
        for entry in job.progress_history
    ]


@router.post("/{job_id}/progress", response_model=JobDetail)
def update_job_progress(
    job_id: int,
    payload: JobStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    job = _get_job_or_404(job_id, db)
    check_job_access(job, current_user)

    if payload.status not in JOB_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid job status.")

    job.status = payload.status
    db.add(
        JobProgress(
            job_id=job.id,
            status=payload.status,
            note=payload.note,
            updated_by=current_user.id,
        )
    )
    db.add(job)

    notify(
        db,
        job.client_id,
        "job",
        f"{job.job_number} status updated to {payload.status}",
        link=f"/portal/orders/{job.id}",
    )

    db.commit()

    return _to_detail(_get_job_or_404(job.id, db), db, current_user)
