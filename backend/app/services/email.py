import os
import smtplib
from email.mime.text import MIMEText

SMTP_HOST = os.environ.get("SMTP_HOST")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")
FROM_EMAIL = os.environ.get("FROM_EMAIL", SMTP_USER)
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")


def is_email_configured() -> bool:
    return bool(SMTP_HOST and SMTP_USER and SMTP_PASSWORD)


def send_password_reset_email(to_email: str, reset_token: str) -> None:
    """Raises smtplib.SMTPException/OSError on failure — callers decide the fallback."""

    reset_url = f"{FRONTEND_URL}/reset-password?token={reset_token}"
    body = (
        "You requested a password reset for your JobQuant account.\n\n"
        "Click the link below to set a new password (expires in 30 minutes):\n"
        f"{reset_url}\n\n"
        "If you did not request this, you can safely ignore this email."
    )

    message = MIMEText(body)
    message["Subject"] = "Reset your JobQuant password"
    message["From"] = FROM_EMAIL
    message["To"] = to_email

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(FROM_EMAIL, [to_email], message.as_string())
