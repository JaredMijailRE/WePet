from abc import ABC, abstractmethod
from typing import List
from domain.entities.user import User
import uuid

class UserRepository(ABC):

    def __init__(self, dbSession) -> None:
        super().__init__()
        self.dbSession = dbSession

    @abstractmethod
    def find_by_username(self, username) -> User | None:
        pass
    
    @abstractmethod
    def find_by_email(self, email: str) -> User | None:
        pass

    @abstractmethod
    def save(self, user: User) -> User:
        pass

    @abstractmethod
    def find_by_id(self, user_id: uuid.UUID) -> User | None:
        pass

    @abstractmethod
    def find_by_ids(self, user_ids: List[uuid.UUID]) -> List[User]:
        pass