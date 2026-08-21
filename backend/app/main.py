from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes.auth import router as auth_router

# Import models so SQLAlchemy registers them
from app.models.user import User


Base.metadata.create_all(bind=engine)


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