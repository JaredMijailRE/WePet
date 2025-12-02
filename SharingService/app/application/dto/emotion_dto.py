from pydantic import BaseModel
from datetime import datetime
import uuid

class CreateEmotionDTO(BaseModel):
    group_id: uuid.UUID
    emotion: str

class EmotionResponseDTO(BaseModel):
    user_id: uuid.UUID
    emotion: str
    created_at: datetime
    
    class Config:
        from_attributes = True