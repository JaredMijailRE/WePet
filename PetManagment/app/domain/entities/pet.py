import uuid
from enum import Enum
from dataclasses import dataclass
from datetime import datetime

class PetType(str, Enum):
    DOG = "dog"
    CAT = "cat"
    DRAGON = "dragon"

@dataclass
class Pet:
    id: uuid.UUID
    group_id: uuid.UUID
    name: str
    type: PetType
    level: int = 1
    xp: int = 0
    hunger_level: int = 100
    hygiene_level: int = 100
    health_level: int = 100
    happiness_level: int = 100
    created_at: datetime = datetime.now()