from datetime import datetime, timezone
import uuid
import enum

from sqlalchemy import Column, Enum, TIMESTAMP, DECIMAL
from sqlalchemy.dialects.postgresql import UUID
from .database import Base

class EmotionalStatus(enum.Enum):
    HAPPY = "happy"
    SAD = "sad"
    NERVOUS = "nervous"
    ANXIOUS = "anxious"

    CALM = "calm"
    EXITED = "exited"
    FEARFUL = "fearful"
    ANGRY = "angry"
    DISGUSTED = "disgusted"
    SURPRISED = "surprised"
    BORED = "bored"
    DISAPPOINTED = "disappointed"

class EmotionalReport(Base):
    __tablename__ = "emotional_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    group_id = Column(UUID(as_uuid=True), nullable=False)
    emotional_state = Column(Enum(EmotionalStatus), nullable=True)
    reported_at = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))

    # def __repr__(self):
    #     return f"<EmotionalReport id={self.id}>"

class Location(Base):
    __tablename__ = "locations"

    user_id = Column(UUID(as_uuid=True), primary_key=True, unique=True, nullable=False)
    latitude = Column(DECIMAL(9, 6), nullable=False)
    longitude = Column(DECIMAL(9, 6), nullable=False)
    last_update = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))

    # def __repr__(self):
    #     return f"<Location user_id={self.user_id}>"