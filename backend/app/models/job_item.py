from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class JobItem(Base):
    __tablename__ = "job_items"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)

    product_category = Column(String(100), nullable=False)
    product_name = Column(String(150), nullable=False)

    width = Column(Float, nullable=False)
    height = Column(Float, nullable=False)
    area = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False)
    quantity = Column(Integer, nullable=False)

    material = Column(String(100), nullable=False)
    specification = Column(String(150), nullable=False)
    print_type = Column(String(100), nullable=False)
    lamination = Column(String(100), nullable=False)
    installation = Column(String(50), nullable=False)

    predicted_cost = Column(Float, nullable=True)

    job = relationship("Job", back_populates="items")
