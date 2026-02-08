from sqlalchemy.orm import Session
from typing import List, Optional

import schemas

from database import DBEvent, DBUser


def get_event(db: Session, event_id: int) -> Optional[DBEvent]:
    return db.query(DBEvent).filter(DBEvent.id == event_id).first()


def get_events(db: Session, skip: int = 0, limit: int = 100) -> List[DBEvent]:
    return db.query(DBEvent).offset(skip).limit(limit).all()


def create_event(db: Session, event: schemas.EventCreate, creator_id: int) -> DBEvent:
    # Use model_dump instead of dict method pydantic v2
    event_data = event.model_dump(exclude={"participants"})
    db_event = DBEvent(**event_data, creator_id=creator_id)

    # Add creator to participants list
    participant_ids = set(event.participants or [])
    participant_ids.add(creator_id)

    if participant_ids:
        participants = db.query(DBUser).filter(DBUser.id.in_(participant_ids)).all()
        db_event.participants.extend(participants)

    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def update_event(
    db: Session, event: schemas.EventUpdate, event_id: int
) -> Optional[DBEvent]:
    db_event = get_event(db, event_id)
    if db_event:
        event_data = event.model_dump(exclude_unset=True, exclude={"participants"})
        for key, value in event_data.items():
            setattr(db_event, key, value)
        if event.participants is not None:
            participants = (
                db.query(DBUser).filter(DBUser.id.in_(event.participants)).all()
            )
            db_event.participants = participants
        db.commit()
        db.refresh(db_event)
    return db_event


def delete_event(db: Session, event_id: int) -> Optional[DBEvent]:
    db_event = get_event(db, event_id)
    if db_event:
        db.delete(db_event)
        db.commit()
    return db_event
