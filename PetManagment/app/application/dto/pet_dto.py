from pydantic import BaseModel
from app.domain.entities.pet import PetType
import uuid

class PetCreateDTO(BaseModel):
    group_id: uuid.UUID
    name: str
    type: PetType

class PetResponseDTO(BaseModel):
    id: uuid.UUID
    name: str
    type: PetType
    health_level: int
    happiness_level: int