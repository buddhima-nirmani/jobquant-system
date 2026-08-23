from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import relationship

from app.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    job_number = Column(String(20), unique=True, nullable=False, index=True)
    job_name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    job_type = Column(String(100), nullable=True)

    client_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_staff_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    order_date = Column(Date, nullable=False)
    due_date = Column(Date, nullable=True)
    priority = Column(String(20), default="Medium", nullable=False)
    status = Column(String(40), default="Pending", nullable=False)

    transportation_required = Column(Boolean, default=False)
    transport_distance = Column(Float, nullable=True)

    predicted_cost = Column(Float, nullable=True)
    final_cost = Column(Float, nullable=True)

    notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=func.now(), server_default=func.now())
    updated_at = Column(
        DateTime,
        default=func.now(),
        onupdate=func.now(),
        server_default=func.now(),
    )

    client = relationship("User", foreign_keys=[client_id])
    assigned_staff = relationship("User", foreign_keys=[assigned_staff_id])
    creator = relationship("User", foreign_keys=[created_by])

    items = relationship(
        "JobItem",
        back_populates="job",
        cascade="all, delete-orphan",
    )

    progress_history = relationship(
        "JobProgress",
        back_populates="job",
        cascade="all, delete-orphan",
        order_by="JobProgress.created_at",
    )

    design_versions = relationship(
        "DesignVersion",
        back_populates="job",
        cascade="all, delete-orphan",
        order_by="DesignVersion.version_number",
    )

    payments = relationship(
        "Payment",
        back_populates="job",
        cascade="all, delete-orphan",
    )

    invoices = relationship(
        "Invoice",
        back_populates="job",
        cascade="all, delete-orphan",
    )
