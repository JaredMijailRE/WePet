import uuid
from dataclasses import dataclass
from datetime import datetime
from app.adapter.db.models import ActivityStatus

@dataclass
class Activity:
    id: uuid.UUID
    group_id: uuid.UUID
    title: str
    description: str | None
    start_date: datetime
    end_date: datetime
    xp_reward: int
    status: ActivityStatus
    created_at: datetime


