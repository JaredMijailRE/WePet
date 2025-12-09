import uuid
from enum import Enum
from dataclasses import dataclass
from datetime import datetime

class PetType(str, Enum):
    DOG = "dog"
    CAT = "cat"
    DRAGON = "dragon"
    DUCK = "duck"

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

    def feed(self):
        self.hunger_level = min(100, self.hunger_level + 20)
        self.gain_xp(10)

    def clean(self):
        self.hygiene_level = min(100, self.hygiene_level + 20)
        self.gain_xp(10)

    def update_name(self, new_name: str):
        self.name = new_name

    def gain_xp(self, amount: int):
        self.xp += amount
        # Simple level up logic
        while self.xp >= self.level * 50:
            self.xp -= self.level * 50
            self.level += 1