from sqlalchemy.orm import Session

from app.models.notification import Notification


def notify(
    db: Session,
    user_id: int | None,
    notif_type: str,
    title: str,
    link: str | None = None,
    job_id: int | None = None,
) -> None:
    """Queue a notification for a user on the current session. Does not
    commit — relies on the caller's own db.commit() so it's created
    atomically with whatever business event triggered it.

    When ``job_id`` is given, ``title`` may contain "{job_number}"/
    "{job_name}" placeholders instead of the job's current values baked in
    directly — the notifications route substitutes them from the job's
    live row at read time, so a later rename doesn't leave every past
    notification permanently showing the old number/name."""

    if not user_id:
        return

    db.add(
        Notification(
            user_id=user_id,
            type=notif_type,
            title=title,
            link=link,
            job_id=job_id,
        )
    )
