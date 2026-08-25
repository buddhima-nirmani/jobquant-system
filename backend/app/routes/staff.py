from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_admin, require_staff_or_admin
from app.models.job import Job
from app.models.user import User
from app.schemas.staff import (
    ResetPasswordRequest,
    StaffCreate,
    StaffResponse,
    StaffUpdate,
)
from app.services.auth import hash_password

router = APIRouter(prefix="/api/staff", tags=["Staff"])


def _to_response(user: User, assigned_jobs: int) -> StaffResponse:
    return StaffResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        is_active=user.is_active,
        assigned_jobs=assigned_jobs,
        created_at=user.created_at,
    )


def _assigned_jobs_count(db: Session, staff_id: int) -> int:
    return (
        db.query(func.count(Job.id))
        .filter(
            Job.assigned_staff_id == staff_id,
            Job.status.notin_(["Completed", "Cancelled"]),
        )
        .scalar()
        or 0
    )


@router.get("", response_model=list[StaffResponse])
def list_staff(
    q: str | None = None,
    db: Session = Depends(get_db),
    _=Depends(require_staff_or_admin),
):
    query = db.query(User).filter(User.role == "staff")

    if q:
        like = f"%{q}%"
        query = query.filter((User.name.ilike(like)) | (User.email.ilike(like)))

    staff_members = query.order_by(User.created_at.desc()).all()

    return [
        _to_response(member, _assigned_jobs_count(db, member.id))
        for member in staff_members
    ]


@router.post("", response_model=StaffResponse, status_code=201)
def create_staff(
    payload: StaffCreate,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=400, detail="Email is already registered.")

    staff_member = User(
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        password_hash=hash_password(payload.password),
        role="staff",
        is_active=True,
    )

    db.add(staff_member)
    db.commit()
    db.refresh(staff_member)

    return _to_response(staff_member, 0)


@router.put("/{staff_id}", response_model=StaffResponse)
def update_staff(
    staff_id: int,
    payload: StaffUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    staff_member = (
        db.query(User).filter(User.id == staff_id, User.role == "staff").first()
    )

    if not staff_member:
        raise HTTPException(status_code=404, detail="Staff member not found.")

    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(staff_member, field, value)

    db.add(staff_member)
    db.commit()
    db.refresh(staff_member)

    return _to_response(staff_member, _assigned_jobs_count(db, staff_member.id))


@router.post("/{staff_id}/reset-password")
def reset_staff_password(
    staff_id: int,
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    staff_member = (
        db.query(User).filter(User.id == staff_id, User.role == "staff").first()
    )

    if not staff_member:
        raise HTTPException(status_code=404, detail="Staff member not found.")

    if len(payload.new_password) < 8:
        raise HTTPException(
            status_code=400, detail="New password must be at least 8 characters."
        )

    staff_member.password_hash = hash_password(payload.new_password)
    db.add(staff_member)
    db.commit()

    return {"message": "Password reset successfully."}
