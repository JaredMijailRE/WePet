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
    hunger_level: int
    hygiene_level: int
    level: int
    xp: int

class PetNameUpdateDTO(BaseModel):
    name: str

class PetStatsUpdateDTO(BaseModel):
    hunger_level: int = None
    hygiene_level: int = None
    health_level: int = None
    happiness_level: int = None