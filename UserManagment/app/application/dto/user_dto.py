from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional
import uuid

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    birth_date: date

class UserResponse(BaseModel):
    id: uuid.UUID
    username: str
    email: EmailStr

    class Config:
        from_attributes = True

class UserDTO(BaseModel):
    id: uuid.UUID
    username: str
    email: EmailStr
    birth_date: date
    current_emotional_status: Optional[str] = None
    its_sharing_location: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True