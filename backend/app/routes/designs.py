from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.dependencies import get_current_user, require_staff_or_admin
from app.models.design import DesignComment, DesignVersion
from app.models.job import Job
from app.models.user import User
from app.schemas.design import (
    DesignCommentCreate,
    DesignCommentResponse,
    DesignCommentUpdate,
    DesignVersionResponse,
)
from app.services.access import check_job_access
from app.services.notifications import notify
from app.services.payments import is_fully_paid
from app.services.storage import resolve_path, save_design_file

router = APIRouter(tags=["Designs"])


def _get_job(job_id: int, db: Session) -> Job:
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    return job


def _comment_permissions(comment: DesignComment, current_user: User) -> tuple[bool, bool]:
    can_edit = comment.user_id == current_user.id
    can_delete = (
        current_user.role == "client" and comment.user_id == current_user.id
    ) or (current_user.role == "admin" and comment.user.role in ("admin", "staff"))
    return can_edit, can_delete


def _to_comment_response(comment: DesignComment, current_user: User) -> DesignCommentResponse:
    can_edit, can_delete = _comment_permissions(comment, current_user)
    return DesignCommentResponse(
        id=comment.id,
        design_version_id=comment.design_version_id,
        user_id=comment.user_id,
        user_name=comment.user.name,
        user_role=comment.user.role,
        comment=comment.comment,
        is_revision_request=comment.is_revision_request,
        created_at=comment.created_at,
        updated_at=comment.updated_at,
        can_edit=can_edit,
        can_delete=can_delete,
    )


def _notify_job_team(db: Session, job: Job, notif_type: str, title: str, link: str) -> None:
    recipients = {job.assigned_staff_id, job.created_by} - {None}
    for user_id in recipients:
        notify(db, user_id, notif_type, title, link=link)


def _get_version(version_id: int, db: Session) -> DesignVersion:
    version = (
        db.query(DesignVersion)
        .options(joinedload(DesignVersion.job))
        .filter(DesignVersion.id == version_id)
        .first()
    )
    if not version:
        raise HTTPException(status_code=404, detail="Design version not found.")
    return version


def _to_response(
    version: DesignVersion, db: Session, current_user: User
) -> DesignVersionResponse:
    if current_user.role in ("admin", "staff"):
        has_original_access = True
    else:
        has_original_access = is_fully_paid(db, version.job)

    return DesignVersionResponse(
        id=version.id,
        job_id=version.job_id,
        version_number=version.version_number,
        status=version.status,
        uploaded_by=version.uploaded_by,
        uploaded_by_name=version.uploader.name,
        uploaded_at=version.uploaded_at,
        approved_at=version.approved_at,
        has_original_access=has_original_access,
    )


@router.post(
    "/api/jobs/{job_id}/designs",
    response_model=DesignVersionResponse,
    status_code=201,
)
def upload_design_version(
    job_id: int,
    file: UploadFile,
    apply_watermark: bool = Form(default=True),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    job = _get_job(job_id, db)
    check_job_access(job, current_user)

    original_path, watermarked_path = save_design_file(file, apply_watermark)

    last_version = (
        db.query(DesignVersion)
        .filter(DesignVersion.job_id == job_id)
        .order_by(DesignVersion.version_number.desc())
        .first()
    )

    db.query(DesignVersion).filter(
        DesignVersion.job_id == job_id,
        DesignVersion.status.in_(["Pending Review", "Revision Requested"]),
    ).update({"status": "Superseded"})

    version = DesignVersion(
        job_id=job_id,
        version_number=(last_version.version_number + 1) if last_version else 1,
        original_file_path=original_path,
        watermarked_file_path=watermarked_path,
        status="Pending Review",
        uploaded_by=current_user.id,
    )

    db.add(version)

    notify(
        db,
        job.client_id,
        "design",
        f"New design version uploaded for {job.job_number}",
        link=f"/portal/orders/{job.id}",
    )

    db.commit()
    db.refresh(version)

    return _to_response(version, db, current_user)


@router.get(
    "/api/jobs/{job_id}/designs",
    response_model=list[DesignVersionResponse],
)
def list_design_versions(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = _get_job(job_id, db)
    check_job_access(job, current_user)

    versions = (
        db.query(DesignVersion)
        .options(joinedload(DesignVersion.uploader), joinedload(DesignVersion.job))
        .filter(DesignVersion.job_id == job_id)
        .order_by(DesignVersion.version_number)
        .all()
    )

    return [_to_response(version, db, current_user) for version in versions]


@router.get("/api/designs/{version_id}/file")
def get_design_file(
    version_id: int,
    type: str = "watermarked",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    version = _get_version(version_id, db)
    check_job_access(version.job, current_user)

    if type not in ("watermarked", "original"):
        raise HTTPException(status_code=400, detail="Invalid file type requested.")

    if type == "original":
        if current_user.role == "client" and not is_fully_paid(db, version.job):
            raise HTTPException(
                status_code=403,
                detail="The final design is released after payment is verified.",
            )
        relative_path = version.original_file_path
    else:
        relative_path = version.watermarked_file_path

    return FileResponse(resolve_path(relative_path))


@router.post("/api/designs/{version_id}/approve", response_model=DesignVersionResponse)
def approve_design(
    version_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "client":
        raise HTTPException(
            status_code=403, detail="Only the client can approve a design."
        )

    version = _get_version(version_id, db)
    check_job_access(version.job, current_user)

    version.status = "Approved"
    version.approved_at = func.now()
    db.add(version)

    _notify_job_team(
        db,
        version.job,
        "design",
        f"Client approved the design for {version.job.job_number}",
        link=f"/staff/jobs/{version.job_id}",
    )

    db.commit()
    db.refresh(version)

    return _to_response(version, db, current_user)


@router.post(
    "/api/designs/{version_id}/revision", response_model=DesignVersionResponse
)
def request_revision(
    version_id: int,
    payload: DesignCommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "client":
        raise HTTPException(
            status_code=403, detail="Only the client can request a revision."
        )

    version = _get_version(version_id, db)
    check_job_access(version.job, current_user)

    version.status = "Revision Requested"
    db.add(version)
    db.add(
        DesignComment(
            job_id=version.job_id,
            design_version_id=version.id,
            user_id=current_user.id,
            comment=payload.comment,
            is_revision_request=True,
        )
    )

    _notify_job_team(
        db,
        version.job,
        "design",
        f"Revision requested on {version.job.job_number}",
        link=f"/staff/jobs/{version.job_id}",
    )

    db.commit()
    db.refresh(version)

    return _to_response(version, db, current_user)


@router.get(
    "/api/designs/{version_id}/comments",
    response_model=list[DesignCommentResponse],
)
def list_comments(
    version_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    version = _get_version(version_id, db)
    check_job_access(version.job, current_user)

    comments = (
        db.query(DesignComment)
        .options(joinedload(DesignComment.user))
        .filter(DesignComment.design_version_id == version_id)
        .order_by(DesignComment.created_at)
        .all()
    )

    return [_to_comment_response(comment, current_user) for comment in comments]


@router.post(
    "/api/designs/{version_id}/comments",
    response_model=DesignCommentResponse,
    status_code=201,
)
def add_comment(
    version_id: int,
    payload: DesignCommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    version = _get_version(version_id, db)
    check_job_access(version.job, current_user)

    comment = DesignComment(
        job_id=version.job_id,
        design_version_id=version.id,
        user_id=current_user.id,
        comment=payload.comment,
        is_revision_request=False,
    )

    db.add(comment)

    if current_user.role == "client":
        _notify_job_team(
            db,
            version.job,
            "design",
            f"New comment on {version.job.job_number}",
            link=f"/staff/jobs/{version.job_id}",
        )
    else:
        notify(
            db,
            version.job.client_id,
            "design",
            f"New comment on your order {version.job.job_number}",
            link=f"/portal/orders/{version.job_id}",
        )

    db.commit()
    db.refresh(comment)

    return _to_comment_response(comment, current_user)


def _get_comment(comment_id: int, db: Session) -> DesignComment:
    comment = (
        db.query(DesignComment)
        .options(joinedload(DesignComment.user), joinedload(DesignComment.design_version).joinedload(DesignVersion.job))
        .filter(DesignComment.id == comment_id)
        .first()
    )
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found.")
    return comment


@router.put(
    "/api/designs/comments/{comment_id}",
    response_model=DesignCommentResponse,
)
def edit_comment(
    comment_id: int,
    payload: DesignCommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = _get_comment(comment_id, db)
    check_job_access(comment.design_version.job, current_user)

    can_edit, _ = _comment_permissions(comment, current_user)
    if not can_edit:
        raise HTTPException(
            status_code=403, detail="You can only edit your own comments."
        )

    comment.comment = payload.comment
    comment.updated_at = func.now()
    db.add(comment)
    db.commit()
    db.refresh(comment)

    return _to_comment_response(comment, current_user)


@router.delete("/api/designs/comments/{comment_id}")
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    comment = _get_comment(comment_id, db)
    check_job_access(comment.design_version.job, current_user)

    _, can_delete = _comment_permissions(comment, current_user)
    if not can_delete:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to delete this comment.",
        )

    db.delete(comment)
    db.commit()

    return {"message": "Comment deleted successfully."}
