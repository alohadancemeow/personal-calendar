from sqlalchemy import Column, Integer, String, Table, ForeignKey, Date
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB as PG_JSONB
from sqlalchemy.types import TypeDecorator
import json
from app.db.base import Base


class JSONBType(TypeDecorator):
    impl = String
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if dialect.name == "postgresql":
            return value
        if value is not None:
            return json.dumps(value)
        return value

    def process_result_value(self, value, dialect):
        if dialect.name == "postgresql":
            return value
        if value is not None:
            return json.loads(value)
        return value

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(PG_JSONB())
        return dialect.type_descriptor(String())

    @property
    def python_type(self):
        return dict


# Association table for event participants (many-to-many)
event_participants = Table(
    "event_participants",
    Base.metadata,
    Column("event_id", ForeignKey("events.id"), primary_key=True),
    Column("user_id", ForeignKey("users.id"), primary_key=True),
)


class DBUser(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)  # Make nullable for OAuth users
    image = Column(String, nullable=True)
    google_id = Column(String, unique=True, nullable=True)
    github_id = Column(String, unique=True, nullable=True)
    provider = Column(String, nullable=True)  # 'google', 'github', or 'local'

    events = relationship("DBEvent", back_populates="creator")
    participating_in = relationship(
        "DBEvent", secondary=event_participants, back_populates="participants"
    )

    def __repr__(self):
        return f"<User(username='{self.username}', email='{self.email}')>"


class DBEvent(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    start_date = Column(Date, nullable=False)
    time = Column(String)
    duration = Column(String)
    type = Column(String)
    startMinute = Column(Integer)
    endMinute = Column(Integer)
    description = Column(String, nullable=True)
    location = Column(JSONBType, nullable=True)
    creator_id = Column(Integer, ForeignKey("users.id"))

    creator = relationship("DBUser", back_populates="events")
    participants = relationship(
        "DBUser", secondary=event_participants, back_populates="participating_in"
    )

    def __repr__(self):
        return f"<Event(title='{self.title}')>"
