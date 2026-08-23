from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), nullable=True)
    payment_slip_path = Column(String(500), nullable=True)

    status = Column(String(20), default="Pending", nullable=False)
    rejection_reason = Column(Text, nullable=True)

    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    verified_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=func.now(), server_default=func.now())

    job = relationship("Job", back_populates="payments")
    client = relationship("User", foreign_keys=[client_id])
    uploader = relationship("User", foreign_keys=[uploaded_by])
    verifier = relationship("User", foreign_keys=[verified_by])
