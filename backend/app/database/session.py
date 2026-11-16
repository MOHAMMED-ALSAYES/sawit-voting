from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool
from app.core.config import settings

# In serverless environments (like Vercel), NullPool prevents connection leaks
# and connects instantly to Supabase pooler without idle connection overhead.
is_serverless = bool(settings.DATABASE_URL)

if is_serverless:
    engine = create_engine(
        settings.SQLALCHEMY_DATABASE_URI,
        poolclass=NullPool,
        connect_args={"connect_timeout": 10}
    )
else:
    engine = create_engine(
        settings.SQLALCHEMY_DATABASE_URI,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
