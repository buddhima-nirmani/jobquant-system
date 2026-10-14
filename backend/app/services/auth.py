import os
import secrets
from datetime import datetime, timedelta, timezone
from pathlib import Path

import bcrypt
from dotenv import load_dotenv
from jose import jwt

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


def _load_or_create_secret_key() -> str:
    """Reads SECRET_KEY from backend/.env. Loads it directly here (rather
    than trusting that whatever imported this module already called
    load_dotenv(), e.g. main.py does) so that standalone scripts — seed
    scripts, one-off shell commands, anything that imports this module
    without going through the FastAPI app — see the same key instead of
    each minting and appending a fresh one. load_dotenv() never overrides a
    variable that's already set, so this is a no-op when main.py already
    loaded it. If it's still missing — e.g. a fresh checkout with no .env
    yet — generate a random one and append it to .env so it stays the same
    across restarts; otherwise every server restart would invalidate every
    existing login token."""

    load_dotenv(ENV_FILE)

    existing = os.environ.get("SECRET_KEY")
    if existing:
        return existing

    generated = secrets.token_hex(32)

    try:
        with open(ENV_FILE, "a", encoding="utf-8") as f:
            f.write(f"\nSECRET_KEY={generated}\n")
    except OSError:
        pass

    return generated


SECRET_KEY = _load_or_create_secret_key()
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 


def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)

    return hashed.decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(
        password.encode("utf-8"),
        password_hash.encode("utf-8")
    )


def create_access_token(user_id: int, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "role": role,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )