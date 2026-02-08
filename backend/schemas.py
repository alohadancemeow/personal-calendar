from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from enum import Enum


# --- User Schemas ---
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str = Field(..., max_length=50)
    image: Optional[str] = None  # Optional image URL


class UserInDB(UserCreate):
    hashed_password: str


class UserResponse(BaseModel):
    id: int  # Add id to UserResponse
    username: str
    email: EmailStr
    image: Optional[str] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


# --- Event Schemas ---
class EventType(str, Enum):
    work = "work"
    personal = "personal"
    social = "social"
    project = "project"


class LocationEnum(str, Enum):
    online = "online"
    onsite = "onsite"


class LocationType(BaseModel):
    type: LocationEnum
    platform: Optional[str] = None
    link: Optional[str] = None
    address: Optional[str] = None


class EventBase(BaseModel):
    title: str
    time: str
    duration: str
    type: EventType
    startMinute: int
    endMinute: int
    description: Optional[str] = None
    location: Optional[LocationType] = None


class EventCreate(EventBase):
    participants: Optional[List[int]] = []  # List of user IDs


class EventUpdate(EventBase):
    participants: Optional[List[int]] = []  # List of user IDs


class EventResponse(EventBase):
    id: int
    creator: UserResponse
    participants: List[UserResponse] = []

    class Config:
        from_attributes = True
