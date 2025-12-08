from .database import Base
import uuid
import enum
from datetime import datetime, timezone
from sqlalchemy import Column, String, TIMESTAMP, ForeignKey, Text, Integer, Enum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID

class ActivityStatus(str, enum.Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    COMPLETED = "completed"

class Role(str, enum.Enum):
    ADMIN = "admin"
    MEMBER = "member"

class Group(Base):
    __tablename__ = "groups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String(50), nullable=False)
    invite_code = Column(String(50), nullable=False, unique=True)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))

    members = relationship("GroupMember", back_populates="group", cascade="all, delete")
    activities = relationship("Activity", back_populates="group", cascade="all, delete")

class Activity(Base):
    __tablename__ = "activities"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    group_id = Column(UUID(as_uuid=True), ForeignKey("groups.id"), nullable=False)
    title = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(TIMESTAMP, nullable=False, default=datetime.now(timezone.utc))
    end_date = Column(TIMESTAMP, nullable=False)
    xp_reward = Column(Integer, nullable=False)
    status = Column(Enum(ActivityStatus), nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))

    group = relationship("Group", back_populates="activities")

class GroupMember(Base):
    __tablename__ = "group_members"

    group_id = Column(UUID(as_uuid=True), ForeignKey("groups.id"), primary_key=True)
    user_id = Column(UUID(as_uuid=True), primary_key=True)
    role = Column(Enum(Role), nullable=False)
    is_sharing_location_with_group = Column(Boolean, nullable=False, default=False)
    has_notifications_enabled = Column(Boolean, nullable=False, default=False)
    joined_at = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))

    group = relationship("Group", back_populates="members")