from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.dependencies import get_current_user, require_staff_or_admin
from app.models.job import Job
from app.models.payment import Payment
from app.models.user import User
from app.schemas.payment import PaymentRejectRequest, PaymentResponse
from app.services.access import check_job_access
from app.services.notifications import notify
from app.services.payments import paid_amount
from app.services.storage import PAYMENT_SLIPS_DIR, DOCUMENT_ALLOWED_EXTENSIONS, resolve_path, save_file

router = APIRouter(tags=["Payments"])

def _get_job(job_id: int, db: Session) -> Job:
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    return job

def _get_payment(payment_id: int, db: Session) -> Payment:
    payment = (
        db.query(Payment)
        .options(
            joinedload(Payment.job),
            joinedload(Payment.client),
            joinedload(Payment.uploader),
        )
        .filter(Payment.id == payment_id)
        .first()
    )
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found.")
    return payment

def _to_response(payment: Payment, db: Session) -> PaymentResponse:
    job_final_cost = payment.job.final_cost
    outstanding = (
        None
        if job_final_cost is None
        else round(job_final_cost - paid_amount(db, payment.job_id), 2)
    )

    return PaymentResponse(
        id=payment.id,
        job_id=payment.job_id,
        job_number=payment.job.job_number,
        client_id=payment.client_id,
        client_name=payment.client.name,
        uploaded_by=payment.uploaded_by,
        uploaded_by_name=payment.uploader.name,
        amount=payment.amount,
        payment_method=payment.payment_method,
        status=payment.status,
        rejection_reason=payment.rejection_reason,
        verified_by=payment.verified_by,
        verified_at=payment.verified_at,
        created_at=payment.created_at,
        has_slip=bool(payment.payment_slip_path),
        outstanding_amount=outstanding,
    )

@router.post(
    "/api/jobs/{job_id}/payments",
    response_model=PaymentResponse,
    status_code=201,
)
def upload_payment_slip(
    job_id: int,
    amount: float = Form(...),
    payment_method: str | None = Form(default=None),
    slip: UploadFile | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = _get_job(job_id, db)
    check_job_access(job, current_user)

    if amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero.")

    if slip is None:
        raise HTTPException(
            status_code=400,
            detail="Please attach an image or PDF of the payment slip.",
        )

    slip_path = None
    if slip is not None:
        slip_path = save_file(slip, PAYMENT_SLIPS_DIR, DOCUMENT_ALLOWED_EXTENSIONS)

    payment = Payment(
        job_id=job_id,
        client_id=job.client_id,
        uploaded_by=current_user.id,
        amount=amount,
        payment_method=payment_method,
        payment_slip_path=slip_path,
        status="Pending",
    )

    db.add(payment)

    for recipient in {job.assigned_staff_id, job.created_by} - {None, current_user.id}:
        notify(
            db,
            recipient,
            "payment",
            "Payment slip uploaded for {job_number}",
            link=f"/staff/jobs/{job.id}",
            job_id=job.id,
        )

    db.commit()
    db.refresh(payment)

    return _to_response(payment, db)

@router.get("/api/payments", response_model=list[PaymentResponse])
def list_payments(
    status_filter: str | None = None,
    job_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Payment).options(
        joinedload(Payment.job),
        joinedload(Payment.client),
        joinedload(Payment.uploader),
    )

    if current_user.role == "client":
        query = query.filter(Payment.client_id == current_user.id)
    elif current_user.role == "staff":
        query = query.join(Job).filter(
            (Job.assigned_staff_id == current_user.id)
            | (Job.created_by == current_user.id)
        )

    if job_id:
        query = query.filter(Payment.job_id == job_id)

    if status_filter:
        query = query.filter(Payment.status == status_filter)

    payments = query.order_by(Payment.created_at.desc()).all()

    return [_to_response(payment, db) for payment in payments]

@router.get("/api/payments/{payment_id}", response_model=PaymentResponse)
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payment = _get_payment(payment_id, db)
    check_job_access(payment.job, current_user)

    return _to_response(payment, db)

@router.get("/api/payments/{payment_id}/slip")
def get_payment_slip(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payment = _get_payment(payment_id, db)
    check_job_access(payment.job, current_user)

    if not payment.payment_slip_path:
        raise HTTPException(status_code=404, detail="No payment slip was uploaded.")

    return FileResponse(resolve_path(payment.payment_slip_path))

@router.post("/api/payments/{payment_id}/verify", response_model=PaymentResponse)
def verify_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    payment = _get_payment(payment_id, db)
    check_job_access(payment.job, current_user)

    payment.status = "Verified"
    payment.rejection_reason = None
    payment.verified_by = current_user.id
    payment.verified_at = func.now()

    db.add(payment)

    notify(
        db,
        payment.client_id,
        "payment",
        "Your payment for {job_number} was verified",
        link=f"/portal/orders/{payment.job_id}",
        job_id=payment.job_id,
    )

    db.commit()
    db.refresh(payment)

    return _to_response(payment, db)

@router.post("/api/payments/{payment_id}/reject", response_model=PaymentResponse)
def reject_payment(
    payment_id: int,
    payload: PaymentRejectRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_staff_or_admin),
):
    payment = _get_payment(payment_id, db)
    check_job_access(payment.job, current_user)

    payment.status = "Rejected"
    payment.rejection_reason = payload.reason
    payment.verified_by = current_user.id

    payment.verified_at = func.now()

    db.add(payment)

    notify(
        db,
        payment.client_id,
        "payment",
        "Your payment for {job_number} was rejected",
        link=f"/portal/orders/{payment.job_id}",
        job_id=payment.job_id,
    )

    db.commit()
    db.refresh(payment)

    return _to_response(payment, db)


@router.delete("/api/payments/{payment_id}")
def delete_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    payment = _get_payment(payment_id, db)
    check_job_access(payment.job, current_user)

    if payment.uploaded_by != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only delete a payment record you uploaded.",
        )

    if current_user.role == "client" and payment.status == "Verified":
        raise HTTPException(
            status_code=403,
            detail="This payment has already been verified and can no longer be deleted.",
        )

    db.delete(payment)
    db.commit()

    return {"message": "Payment deleted successfully."}
