from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import relationship

from app.database import Base


class DesignVersion(Base):
    __tablename__ = "design_versions"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    version_number = Column(Integer, nullable=False)

    original_file_path = Column(String(500), nullable=False)
    watermarked_file_path = Column(String(500), nullable=False)

    status = Column(String(40), default="Pending Review", nullable=False)

    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    uploaded_at = Column(DateTime, default=func.now(), server_default=func.now())
    approved_at = Column(DateTime, nullable=True)

    job = relationship("Job", back_populates="design_versions")
    uploader = relationship("User")

    comments = relationship(
        "DesignComment",
        back_populates="design_version",
        cascade="all, delete-orphan",
        order_by="DesignComment.created_at",
    )


class DesignComment(Base):
    __tablename__ = "design_comments"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    design_version_id = Column(
        Integer, ForeignKey("design_versions.id"), nullable=False
    )
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    comment = Column(Text, nullable=False)
    is_revision_request = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now(), server_default=func.now())
    updated_at = Column(DateTime, nullable=True)

    design_version = relationship("DesignVersion", back_populates="comments")
    user = relationship("User")
