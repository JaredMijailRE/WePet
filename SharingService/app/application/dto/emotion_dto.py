from pydantic import BaseModel
from datetime import datetime
import uuid
from typing import List
from typing import Optional

class CreateEmotionDTO(BaseModel):
    group_ids: List[uuid.UUID]
    emotion: str
    user_name: str

class EmotionResponseDTO(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    user_name: Optional[str] = "Usuario"
    group_id: uuid.UUID
    emotion: str
    created_at: datetime
    
    class Config:
        from_attributes = True