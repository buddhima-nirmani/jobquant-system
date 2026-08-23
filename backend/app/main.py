from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, run_startup_migrations

# Import models so SQLAlchemy registers them before create_all runs.
import app.models  # noqa: F401

from app.routes.auth import router as auth_router
from app.routes.clients import router as clients_router
from app.routes.dashboard import router as dashboard_router
from app.routes.designs import router as designs_router
from app.routes.invoices import router as invoices_router
from app.routes.jobs import router as jobs_router
from app.routes.notifications import router as notifications_router
from app.routes.payments import router as payments_router
from app.routes.prediction import router as prediction_router
from app.routes.staff import router as staff_router


Base.metadata.create_all(bind=engine)
run_startup_migrations()


app = FastAPI(
    title="JobQuant API",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(prediction_router)
app.include_router(clients_router)
app.include_router(staff_router)
app.include_router(jobs_router)
app.include_router(designs_router)
app.include_router(payments_router)
app.include_router(invoices_router)
app.include_router(dashboard_router)
app.include_router(notifications_router)

@app.get("/")
def root():
    return {
        "message": "JobQuant API is running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy"
    }