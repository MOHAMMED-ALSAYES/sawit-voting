from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import admin, competitions, students, voting, results, public
from app.database.session import engine, Base
from app.models.models import Admin
from app.security.security import get_password_hash
from sqlalchemy.orm import Session

# Create all database tables on startup if they don't exist
Base.metadata.create_all(bind=engine)

# Auto seed default admin if no admin exists
with Session(engine) as db:
    admin_exists = db.query(Admin).first()
    if not admin_exists:
        default_admin = Admin(
            username="admin",
            email="admin@sawit.ust.edu",
            password_hash=get_password_hash("admin123"),
            is_active=True
        )
        db.add(default_admin)
        db.commit()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(competitions.router, prefix=settings.API_V1_STR)
app.include_router(students.router, prefix=settings.API_V1_STR)
app.include_router(voting.router, prefix=settings.API_V1_STR)
app.include_router(results.router, prefix=settings.API_V1_STR)
app.include_router(public.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "app": "SAWIT | صَوّت",
        "description": "Educational Voting System - CDC & UST",
        "status": "online",
        "version": "1.0.0"
    }
