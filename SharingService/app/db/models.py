from datetime import datetime, timezone
import uuid

from sqlalchemy import Column, TIMESTAMP, Integer, ForeignKey,String, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from .database import Base

class EmotionalReport(Base):
    __tablename__ = "emotional_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    status_id = Column(Integer, ForeignKey("emotional_status.id"), nullable=False)
    group_id = Column(UUID(as_uuid=True), nullable=False)
    reported_at = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))

    status = relationship("EmotionalStatus", back_populates="reports", cascade="all, delete")

    # def __repr__(self):
    #     return f"<EmotionalReport id={self.id}>"

class EmotionalStatus(Base):
    __tablename__ = "emotional_status"

    id = Column(Integer, primary_key=True, unique=True, nullable=False)
    status = Column(String(20), nullable=False)

    reports = relationship("EmotionalReport", back_populates="status")

class Location(Base):
    __tablename__ = "locations"

    user_id = Column(UUID(as_uuid=True), primary_key=True, unique=True, nullable=False)
    latitude = Column(DECIMAL(9, 6), nullable=False)
    longitude = Column(DECIMAL(9, 6), nullable=False)
    last_update = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))

    # def __repr__(self):
    #     return f"<Location user_id={self.user_id}>"