from datetime import datetime

from pydantic import BaseModel


class InvoiceResponse(BaseModel):
    id: int
    job_id: int
    uploaded_by: int
    uploaded_by_name: str
    uploaded_at: datetime
