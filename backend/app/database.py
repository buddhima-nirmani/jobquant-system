from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./jobquant.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def run_startup_migrations() -> None:
    """Patch pre-existing SQLite tables with columns added after they were
    first created. ``Base.metadata.create_all`` only creates missing
    tables, it never alters existing ones, so this covers the gap for a
    small project without a full migration tool."""

    inspector = inspect(engine)
    table_names = inspector.get_table_names()

    if "payments" in table_names:
        payment_columns = {
            column["name"] for column in inspector.get_columns("payments")
        }

        if "uploaded_by" not in payment_columns:
            with engine.begin() as connection:
                connection.execute(
                    text("ALTER TABLE payments ADD COLUMN uploaded_by INTEGER")
                )
                connection.execute(
                    text(
                        "UPDATE payments SET uploaded_by = client_id "
                        "WHERE uploaded_by IS NULL"
                    )
                )

    if "design_comments" in table_names:
        comment_columns = {
            column["name"] for column in inspector.get_columns("design_comments")
        }

        if "updated_at" not in comment_columns:
            with engine.begin() as connection:
                connection.execute(
                    text("ALTER TABLE design_comments ADD COLUMN updated_at DATETIME")
                )

        if "parent_id" not in comment_columns:
            with engine.begin() as connection:
                connection.execute(
                    text("ALTER TABLE design_comments ADD COLUMN parent_id INTEGER")
                )

    if "notifications" in table_names:
        notification_columns = {
            column["name"] for column in inspector.get_columns("notifications")
        }

        if "job_id" not in notification_columns:
            with engine.begin() as connection:
                connection.execute(
                    text("ALTER TABLE notifications ADD COLUMN job_id INTEGER")
                )

    if "users" not in table_names:
        return

    existing_columns = {
        column["name"] for column in inspector.get_columns("users")
    }

    with engine.begin() as connection:
        if "created_at" not in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE users ADD COLUMN created_at DATETIME "
                    "DEFAULT CURRENT_TIMESTAMP"
                )
            )
            connection.execute(
                text(
                    "UPDATE users SET created_at = CURRENT_TIMESTAMP "
                    "WHERE created_at IS NULL"
                )
            )

        if "updated_at" not in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE users ADD COLUMN updated_at DATETIME "
                    "DEFAULT CURRENT_TIMESTAMP"
                )
            )
            connection.execute(
                text(
                    "UPDATE users SET updated_at = CURRENT_TIMESTAMP "
                    "WHERE updated_at IS NULL"
                )
            )