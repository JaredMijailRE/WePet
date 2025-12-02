from datetime import datetime, timezone
import uuid

from sqlalchemy import Column, DateTime, Integer, ForeignKey,String, DECIMAL, TIMESTAMP

from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .database import Base


class EmotionalReportModel(Base):
    __tablename__ = "emotional_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    group_id = Column(UUID(as_uuid=True), nullable=False, index=True)

    status_id = Column(Integer, ForeignKey("emotional_status.id"), nullable=False)
    
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    status_rel = relationship("EmotionalStatus", back_populates="reports")

    # def __repr__(self):
    #     return f"<EmotionalReport id={self.id}>"

class EmotionalStatus(Base):
    __tablename__ = "emotional_status"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), unique=True, nullable=False)

    reports = relationship("EmotionalReportModel", back_populates="status_rel")

class Location(Base):
    __tablename__ = "locations"

    user_id = Column(UUID(as_uuid=True), primary_key=True, unique=True, nullable=False)
    latitude = Column(DECIMAL(9, 6), nullable=False)
    longitude = Column(DECIMAL(9, 6), nullable=False)
    last_update = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))

    # def __repr__(self):
    #     return f"<Location user_id={self.user_id}>"