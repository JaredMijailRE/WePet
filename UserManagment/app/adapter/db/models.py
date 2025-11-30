from datetime import datetime, timezone
import uuid
import enum

from sqlalchemy import Column, String, Date, Enum, Boolean, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    username = Column(String(50), nullable=False, unique=True, index=True)
    email = Column(String(50), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    birth_date = Column(Date, nullable=False)
    current_emotional_status = Column(String(20), nullable=True)
    its_sharing_location = Column(Boolean, default=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))

    # if needed, maybe use __repr__ for debuggin? something like this
    # def __repr__(self):
    #     return f"<User(username='{self.username}', email='{self.email}')>"