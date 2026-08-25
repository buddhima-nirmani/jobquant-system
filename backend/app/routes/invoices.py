from fastapi import APIRouter, Depends, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.dependencies import get_current_user, require_staff_or_admin
from app.models.invoice import Invoice
from app.models.job import Job
from app.models.user import User
from app.schemas.invoice import InvoiceResponse
from app.services.access import check_job_access
from app.services.notifications import notify
from app.services.storage import DOCUMENT_ALLOWED_EXTENSIONS, INVOICES_DIR, resolve_path, save_file

router = APIRouter(tags=["Invoices"])


def _get_job(job_id: int, db: Session) -> Job:
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    return job


@router.post(
    "/api/jobs/{job_id}/invoice",
    response_model=InvoiceResponse,
    status_code=201,
)
def upload_invoice(
    job_id: int,
    file: UploadFile,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    job = _get_job(job_id, db)
    check_job_access(job, current_user)

    file_path = save_file(file, INVOICES_DIR, DOCUMENT_ALLOWED_EXTENSIONS)

    invoice = Invoice(job_id=job_id, file_path=file_path, uploaded_by=current_user.id)

    db.add(invoice)

    notify(
        db,
        job.client_id,
        "invoice",
        "Invoice available for {job_number}",
        link=f"/portal/orders/{job.id}",
        job_id=job.id,
    )

    db.commit()
    db.refresh(invoice)

    return InvoiceResponse(
        id=invoice.id,
        job_id=invoice.job_id,
        uploaded_by=invoice.uploaded_by,
        uploaded_by_name=current_user.name,
        uploaded_at=invoice.uploaded_at,
    )


@router.get("/api/jobs/{job_id}/invoice", response_model=list[InvoiceResponse])
def list_invoices(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = _get_job(job_id, db)
    check_job_access(job, current_user)

    invoices = (
        db.query(Invoice)
        .options(joinedload(Invoice.uploader))
        .filter(Invoice.job_id == job_id)
        .order_by(Invoice.uploaded_at.desc())
        .all()
    )

    return [
        InvoiceResponse(
            id=invoice.id,
            job_id=invoice.job_id,
            uploaded_by=invoice.uploaded_by,
            uploaded_by_name=invoice.uploader.name,
            uploaded_at=invoice.uploaded_at,
        )
        for invoice in invoices
    ]


@router.get("/api/invoices/{invoice_id}/file")
def get_invoice_file(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    invoice = (
        db.query(Invoice)
        .options(joinedload(Invoice.job))
        .filter(Invoice.id == invoice_id)
        .first()
    )

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found.")

    check_job_access(invoice.job, current_user)

    return FileResponse(resolve_path(invoice.file_path))


@router.delete("/api/invoices/{invoice_id}")
def delete_invoice(
    invoice_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    invoice = (
        db.query(Invoice)
        .options(joinedload(Invoice.job))
        .filter(Invoice.id == invoice_id)
        .first()
    )

    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found.")

    check_job_access(invoice.job, current_user)

    if invoice.uploaded_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only delete an invoice you uploaded.",
        )

    db.delete(invoice)
    db.commit()

    return {"message": "Invoice deleted successfully."}
