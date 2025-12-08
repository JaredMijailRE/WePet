from pydantic import BaseModel
import uuid
from datetime import datetime
from typing import Optional
from app.adapter.db.models import Role, ActivityStatus

class GroupCreateDTO(BaseModel):
    name: str

class JoinGroupDTO(BaseModel):
    invite_code: str

class GroupResponseDTO(BaseModel):
    id: uuid.UUID
    name: str
    invite_code: str

class GroupUpdateDTO(BaseModel):
    name: Optional[str] = None

class GroupMemberDTO(BaseModel):
    group_id: uuid.UUID
    user_id: uuid.UUID
    role: Role
    is_sharing_location_with_group: bool
    has_notifications_enabled: bool
    joined_at: datetime

class GroupMemberUpdateDTO(BaseModel):
    role: Optional[Role] = None
    is_sharing_location_with_group: Optional[bool] = None
    has_notifications_enabled: Optional[bool] = None

class ActivityCreateDTO(BaseModel):
    group_id: uuid.UUID
    title: str
    description: Optional[str] = None
    start_date: datetime
    end_date: datetime
    xp_reward: int
    status: ActivityStatus = ActivityStatus.ACTIVE

class ActivityUpdateDTO(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    xp_reward: Optional[int] = None
    status: Optional[ActivityStatus] = None

class ActivityResponseDTO(BaseModel):
    id: uuid.UUID
    group_id: uuid.UUID
    title: str
    description: Optional[str]
    start_date: datetime
    end_date: datetime
    xp_reward: int
    status: ActivityStatus
    created_at: datetime

class UserActivityResponseDTO(BaseModel):
    id: uuid.UUID
    group_id: uuid.UUID
    group_name: str
    title: str
    description: Optional[str]
    start_date: datetime
    end_date: datetime
    xp_reward: int
    status: ActivityStatus
    created_at: datetime
