from sqlalchemy.orm import Session

from app.models.notification import Notification


def notify(
    db: Session,
    user_id: int | None,
    notif_type: str,
    title: str,
    link: str | None = None,
) -> None:
    """Queue a notification for a user on the current session. Does not
    commit — relies on the caller's own db.commit() so it's created
    atomically with whatever business event triggered it."""

    if not user_id:
        return

    db.add(Notification(user_id=user_id, type=notif_type, title=title, link=link))
