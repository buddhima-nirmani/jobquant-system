from datetime import datetime

from pydantic import BaseModel


class DesignVersionResponse(BaseModel):
    id: int
    job_id: int
    version_number: int
    status: str
    uploaded_by: int
    uploaded_by_name: str
    uploaded_at: datetime
    approved_at: datetime | None
    has_original_access: bool


class DesignCommentCreate(BaseModel):
    comment: str
    is_revision_request: bool = False
    parent_id: int | None = None


class DesignCommentUpdate(BaseModel):
    comment: str


class DesignCommentResponse(BaseModel):
    id: int
    design_version_id: int
    user_id: int
    user_name: str
    user_role: str
    comment: str
    is_revision_request: bool
    parent_id: int | None
    created_at: datetime
    updated_at: datetime | None
    can_edit: bool
    can_delete: bool
