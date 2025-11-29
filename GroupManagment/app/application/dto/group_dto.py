from pydantic import BaseModel
import uuid

class GroupCreateDTO(BaseModel):
    name: str

class JoinGroupDTO(BaseModel):
    invite_code: str

class GroupResponseDTO(BaseModel):
    id: uuid.UUID
    name: str
    invite_code: str