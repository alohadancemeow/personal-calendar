from typing import Optional
from datetime import date
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import schemas
from database import DBUser, get_db
from routers.users import get_current_user

router = APIRouter()


@router.post("/events/", response_model=schemas.EventResponse)
def create_event(
    event: schemas.EventCreate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
):
    return crud.create_event(db=db, event=event, creator_id=current_user.id)


@router.get("/events/", response_model=List[schemas.EventResponse])
def read_events(
    skip: int = 0,
    limit: int = 100,
    date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
):
    events = crud.get_events(
        db, creator_id=current_user.id, skip=skip, limit=limit, event_date=date
    )
    return events


@router.get("/events/{event_id}", response_model=schemas.EventResponse)
def read_event(event_id: int, db: Session = Depends(get_db)):
    db_event = crud.get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event


@router.put("/events/{event_id}", response_model=schemas.EventResponse)
def update_event(
    event_id: int,
    event: schemas.EventUpdate,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
):
    db_event = crud.get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    if db_event.creator_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to update this event"
        )
    return crud.update_event(db=db, event=event, event_id=event_id)


@router.delete("/events/{event_id}", response_model=schemas.EventResponse)
def delete_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: DBUser = Depends(get_current_user),
):
    db_event = crud.get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    if db_event.creator_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this event"
        )
    return crud.delete_event(db=db, event_id=event_id)
