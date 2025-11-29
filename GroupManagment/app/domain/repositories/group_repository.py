from abc import ABC, abstractmethod
from app.domain.entities.group import Group
import uuid

class GroupRepository(ABC):
    @abstractmethod
    def save(self, group: Group) -> Group:
        pass

    @abstractmethod
    def find_by_invite_code(self, code: str) -> Group | None:
        pass

    @abstractmethod
    def add_member(self, group_id: uuid.UUID, user_id: uuid.UUID, role: str):
        pass
    
    @abstractmethod
    def is_member(self, group_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        pass