from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from app.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String(30), nullable=False)
    title = Column(String(255), nullable=False)
    link = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=func.now(), server_default=func.now())

    # When set, ``title`` may contain "{job_number}"/"{job_name}" placeholders
    # that get substituted with the job's CURRENT values at read time, so a
    # notification never shows a stale job number/name after a rename.
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=True)

    user = relationship("User")
    job = relationship("Job")
