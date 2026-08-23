from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_admin, require_staff_or_admin
from app.models.job import Job
from app.models.user import User
from app.schemas.client import ClientResponse, ClientUpdate

router = APIRouter(prefix="/api/clients", tags=["Clients"])


def _to_response(user: User, active_jobs: int) -> ClientResponse:
    return ClientResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        company=user.company,
        is_active=user.is_active,
        active_jobs=active_jobs,
        created_at=user.created_at,
    )


def _active_jobs_count(db: Session, client_id: int) -> int:
    return (
        db.query(func.count(Job.id))
        .filter(
            Job.client_id == client_id,
            Job.status.notin_(["Completed", "Cancelled"]),
        )
        .scalar()
        or 0
    )


@router.get("", response_model=list[ClientResponse])
def list_clients(
    q: str | None = None,
    db: Session = Depends(get_db),
    _=Depends(require_staff_or_admin),
):
    query = db.query(User).filter(User.role == "client")

    if q:
        like = f"%{q}%"
        query = query.filter(
            (User.name.ilike(like))
            | (User.email.ilike(like))
            | (User.company.ilike(like))
        )

    clients = query.order_by(User.created_at.desc()).all()

    return [
        _to_response(client, _active_jobs_count(db, client.id))
        for client in clients
    ]


@router.get("/{client_id}", response_model=ClientResponse)
def get_client(
    client_id: int,
    db: Session = Depends(get_db),
    _=Depends(require_staff_or_admin),
):
    client = (
        db.query(User)
        .filter(User.id == client_id, User.role == "client")
        .first()
    )

    if not client:
        raise HTTPException(status_code=404, detail="Client not found.")

    return _to_response(client, _active_jobs_count(db, client.id))


@router.put("/{client_id}", response_model=ClientResponse)
def update_client(
    client_id: int,
    payload: ClientUpdate,
    db: Session = Depends(get_db),
    _=Depends(require_admin),
):
    client = (
        db.query(User)
        .filter(User.id == client_id, User.role == "client")
        .first()
    )

    if not client:
        raise HTTPException(status_code=404, detail="Client not found.")

    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(client, field, value)

    db.add(client)
    db.commit()
    db.refresh(client)

    return _to_response(client, _active_jobs_count(db, client.id))
