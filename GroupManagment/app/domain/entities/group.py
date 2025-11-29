import uuid
from dataclasses import dataclass

@dataclass
class Group:
    id: uuid.UUID
    name: str
    invite_code: str