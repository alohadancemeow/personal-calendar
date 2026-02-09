from typing import Optional
from sqlalchemy import create_engine, Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship, sessionmaker, Session
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base
from schemas import UserInDB  # Import UserInDB for type hinting or conversion
import os

# Database URL. Adjust as necessary for your Docker setup.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Create a SQLAlchemy engine
# 'pool_pre_ping=True' is good for long-running applications to ensure connections are still alive
engine = create_engine(SQLALCHEMY_DATABASE_URL, echo=True, pool_pre_ping=True)

# Each instance of the SessionLocal class will be a database session.
# The class itself is not a database session yet.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for declarative models
Base = declarative_base()

# Association table for event participants (many-to-many)
event_participants = Table(
    "event_participants",
    Base.metadata,
    Column("event_id", ForeignKey("events.id"), primary_key=True),
    Column("user_id", ForeignKey("users.id"), primary_key=True),
)


# Define the User model for SQLAlchemy
class DBUser(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    image = Column(String, nullable=True)

    events = relationship("DBEvent", back_populates="creator")
    participating_in = relationship(
        "DBEvent", secondary=event_participants, back_populates="participants"
    )

    def __repr__(self):
        return f"<User(username='{self.username}', email='{self.email}')>"


# Define the Event model for SQLAlchemy
class DBEvent(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    time = Column(String)
    duration = Column(String)
    type = Column(String)
    startMinute = Column(Integer)
    endMinute = Column(Integer)
    description = Column(String, nullable=True)
    location = Column(JSONB, nullable=True)
    creator_id = Column(Integer, ForeignKey("users.id"))

    creator = relationship("DBUser", back_populates="events")
    participants = relationship(
        "DBUser", secondary=event_participants, back_populates="participating_in"
    )

    def __repr__(self):
        return f"<Event(title='{self.title}')>"


# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Function to create database tables
def create_db_and_tables():
    Base.metadata.create_all(bind=engine)


def get_user(db: Session, username: str) -> Optional[DBUser]:
    return db.query(DBUser).filter(DBUser.username == username).first()


def get_user_by_email(db: Session, email: str) -> Optional[DBUser]:
    return db.query(DBUser).filter(DBUser.email == email).first()


def create_user(db: Session, user: UserInDB):
    db_user = DBUser(
        username=user.username,
        email=user.email,
        hashed_password=user.hashed_password,
        image=user.image,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user_by_id(db: Session, user_id: int) -> Optional[DBUser]:
    return db.query(DBUser).filter(DBUser.id == user_id).first()
