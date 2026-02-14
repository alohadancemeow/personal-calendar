from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine_args = {"echo": True, "pool_pre_ping": True}

if settings.SQLALCHEMY_DATABASE_URL and settings.SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    settings.SQLALCHEMY_DATABASE_URL = settings.SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(settings.SQLALCHEMY_DATABASE_URL, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
