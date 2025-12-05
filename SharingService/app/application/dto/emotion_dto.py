from pydantic import BaseModel
from datetime import datetime
import uuid
from typing import List

class CreateEmotionDTO(BaseModel):
    group_ids: List[uuid.UUID]
    emotion: str

class EmotionResponseDTO(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    group_id: uuid.UUID
    emotion: str
    created_at: datetime
    
    class Config:
        from_attributes = True