from datetime import date, datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models.design import DesignVersion
from app.models.invoice import Invoice
from app.models.job import Job
from app.models.job_progress import JobProgress
from app.models.payment import Payment
from app.models.user import User
from app.schemas.dashboard import (
    AdminDashboard,
    ClientDashboard,
    RecentActivity,
    RecentJob,
    StaffDashboard,
    TrendPoint,
)

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

ACTIVE_STATUSES_EXCLUDING_PENDING = [
    "Design",
    "Awaiting Client Approval",
    "Approved",
    "Production",
    "Ready for Delivery",
]


def _to_recent_job(job: Job) -> RecentJob:
    return RecentJob(
        id=job.id,
        job_number=job.job_number,
        job_name=job.job_name,
        client_name=job.client.name,
        assigned_staff_name=job.assigned_staff.name if job.assigned_staff else None,
        due_date=job.due_date,
        status=job.status,
        final_cost=job.final_cost,
    )


def _recent_activity(db: Session, limit: int = 8) -> list[RecentActivity]:
    events: list[tuple[str, RecentActivity]] = []

    progress_entries = (
        db.query(JobProgress)
        .options(joinedload(JobProgress.job), joinedload(JobProgress.updated_by_user))
        .order_by(JobProgress.created_at.desc())
        .limit(limit)
        .all()
    )
    for entry in progress_entries:
        events.append(
            (
                entry.created_at.isoformat(),
                RecentActivity(
                    id=f"progress-{entry.id}",
                    type="job",
                    title=f"{entry.job.job_number} moved to {entry.status}",
                    created_at=entry.created_at.isoformat(),
                ),
            )
        )

    designs = (
        db.query(DesignVersion)
        .options(joinedload(DesignVersion.job))
        .order_by(DesignVersion.uploaded_at.desc())
        .limit(limit)
        .all()
    )
    for design in designs:
        events.append(
            (
                design.uploaded_at.isoformat(),
                RecentActivity(
                    id=f"design-{design.id}",
                    type="design",
                    title=f"Design v{design.version_number} uploaded for {design.job.job_number}",
                    created_at=design.uploaded_at.isoformat(),
                ),
            )
        )

    payments = (
        db.query(Payment)
        .options(joinedload(Payment.job))
        .filter(Payment.status == "Verified")
        .order_by(Payment.verified_at.desc())
        .limit(limit)
        .all()
    )
    for payment in payments:
        if not payment.verified_at:
            continue
        events.append(
            (
                payment.verified_at.isoformat(),
                RecentActivity(
                    id=f"payment-{payment.id}",
                    type="payment",
                    title=f"Payment verified for {payment.job.job_number}",
                    created_at=payment.verified_at.isoformat(),
                ),
            )
        )

    invoices = (
        db.query(Invoice)
        .options(joinedload(Invoice.job))
        .order_by(Invoice.uploaded_at.desc())
        .limit(limit)
        .all()
    )
    for invoice in invoices:
        events.append(
            (
                invoice.uploaded_at.isoformat(),
                RecentActivity(
                    id=f"invoice-{invoice.id}",
                    type="invoice",
                    title=f"Invoice uploaded for {invoice.job.job_number}",
                    created_at=invoice.uploaded_at.isoformat(),
                ),
            )
        )

    events.sort(key=lambda pair: pair[0], reverse=True)

    return [item for _, item in events[:limit]]


@router.get("/admin", response_model=AdminDashboard)
def admin_dashboard(
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    total_jobs = db.query(func.count(Job.id)).scalar() or 0
    pending_jobs = (
        db.query(func.count(Job.id)).filter(Job.status == "Pending").scalar() or 0
    )
    jobs_in_progress = (
        db.query(func.count(Job.id))
        .filter(Job.status.in_(ACTIVE_STATUSES_EXCLUDING_PENDING))
        .scalar()
        or 0
    )
    completed_jobs = (
        db.query(func.count(Job.id)).filter(Job.status == "Completed").scalar() or 0
    )
    total_clients = (
        db.query(func.count(User.id)).filter(User.role == "client").scalar() or 0
    )
    active_staff = (
        db.query(func.count(User.id))
        .filter(User.role == "staff", User.is_active.is_(True))
        .scalar()
        or 0
    )
    pending_payments = (
        db.query(func.count(Payment.id)).filter(Payment.status == "Pending").scalar()
        or 0
    )
    verified_revenue = (
        db.query(func.coalesce(func.sum(Payment.amount), 0.0))
        .filter(Payment.status == "Verified")
        .scalar()
        or 0.0
    )

    recent_jobs = (
        db.query(Job)
        .options(joinedload(Job.client), joinedload(Job.assigned_staff))
        .filter(Job.status.notin_(["Completed", "Cancelled"]))
        .order_by(Job.created_at.desc())
        .limit(5)
        .all()
    )

    return AdminDashboard(
        total_jobs=total_jobs,
        pending_jobs=pending_jobs,
        jobs_in_progress=jobs_in_progress,
        completed_jobs=completed_jobs,
        total_clients=total_clients,
        active_staff=active_staff,
        pending_payments=pending_payments,
        verified_revenue=verified_revenue,
        recent_jobs=[_to_recent_job(job) for job in recent_jobs],
        recent_activity=_recent_activity(db),
    )


@router.get("/admin/trend", response_model=list[TrendPoint])
def admin_trend(
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    """Jobs created vs completed per week, for the last 8 weeks. Built
    from real job/progress timestamps — no fabricated data."""

    weeks = 8
    today = date.today()
    start_of_this_week = today - timedelta(days=today.weekday())

    buckets = []
    for i in range(weeks - 1, -1, -1):
        week_start = start_of_this_week - timedelta(weeks=i)
        week_end = week_start + timedelta(days=7)
        buckets.append((week_start, week_end))

    created_jobs = db.query(Job.created_at).all()
    completed_entries = (
        db.query(JobProgress.created_at)
        .filter(JobProgress.status == "Completed")
        .all()
    )

    points: list[TrendPoint] = []
    for week_start, week_end in buckets:
        created_count = sum(
            1
            for (created_at,) in created_jobs
            if created_at and week_start <= created_at.date() < week_end
        )
        completed_count = sum(
            1
            for (created_at,) in completed_entries
            if created_at and week_start <= created_at.date() < week_end
        )
        points.append(
            TrendPoint(
                label=week_start.strftime("%b %d"),
                created=created_count,
                completed=completed_count,
            )
        )

    return points


@router.get("/staff", response_model=StaffDashboard)
def staff_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    base_filter = or_(
        Job.assigned_staff_id == current_user.id,
        Job.created_by == current_user.id,
    )

    assigned_jobs = db.query(func.count(Job.id)).filter(base_filter).scalar() or 0
    active_jobs = (
        db.query(func.count(Job.id))
        .filter(base_filter, Job.status.notin_(["Completed", "Cancelled"]))
        .scalar()
        or 0
    )
    completed_jobs = (
        db.query(func.count(Job.id))
        .filter(base_filter, Job.status == "Completed")
        .scalar()
        or 0
    )
    pending_design_reviews = (
        db.query(func.count(DesignVersion.id))
        .join(Job, DesignVersion.job_id == Job.id)
        .filter(base_filter, DesignVersion.status == "Revision Requested")
        .scalar()
        or 0
    )
    due_soon_cutoff = date.today() + timedelta(days=3)
    jobs_due_soon = (
        db.query(func.count(Job.id))
        .filter(
            base_filter,
            Job.due_date.isnot(None),
            Job.due_date <= due_soon_cutoff,
            Job.status.notin_(["Completed", "Cancelled"]),
        )
        .scalar()
        or 0
    )

    recent_jobs = (
        db.query(Job)
        .options(joinedload(Job.client), joinedload(Job.assigned_staff))
        .filter(base_filter, Job.status.notin_(["Completed", "Cancelled"]))
        .order_by(Job.created_at.desc())
        .limit(5)
        .all()
    )

    return StaffDashboard(
        assigned_jobs=assigned_jobs,
        active_jobs=active_jobs,
        pending_design_reviews=pending_design_reviews,
        jobs_due_soon=jobs_due_soon,
        completed_jobs=completed_jobs,
        recent_jobs=[_to_recent_job(job) for job in recent_jobs],
    )


@router.get("/client", response_model=ClientDashboard)
def client_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    base_filter = Job.client_id == current_user.id

    active_orders = (
        db.query(func.count(Job.id))
        .filter(base_filter, Job.status.notin_(["Completed", "Cancelled"]))
        .scalar()
        or 0
    )
    completed_orders = (
        db.query(func.count(Job.id))
        .filter(base_filter, Job.status == "Completed")
        .scalar()
        or 0
    )
    pending_design_approvals = (
        db.query(func.count(DesignVersion.id))
        .join(Job, DesignVersion.job_id == Job.id)
        .filter(base_filter, DesignVersion.status == "Pending Review")
        .scalar()
        or 0
    )

    jobs = db.query(Job).filter(base_filter).all()
    total_final_cost = sum(job.final_cost or 0 for job in jobs)
    verified_paid = (
        db.query(func.coalesce(func.sum(Payment.amount), 0.0))
        .join(Job, Payment.job_id == Job.id)
        .filter(base_filter, Payment.status == "Verified")
        .scalar()
        or 0.0
    )

    today = date.today()
    month_start = datetime(today.year, today.month, 1)
    paid_this_month = (
        db.query(func.coalesce(func.sum(Payment.amount), 0.0))
        .join(Job, Payment.job_id == Job.id)
        .filter(
            base_filter,
            Payment.status == "Verified",
            Payment.verified_at >= month_start,
        )
        .scalar()
        or 0.0
    )

    return ClientDashboard(
        active_orders=active_orders,
        completed_orders=completed_orders,
        pending_design_approvals=pending_design_approvals,
        outstanding_payments=round(total_final_cost - verified_paid, 2),
        paid_this_month=round(paid_this_month, 2),
    )
