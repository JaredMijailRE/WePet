from pydantic import BaseModel, EmailStr
from datetime import date
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