from abc import ABC, abstractmethod
from domain.entities.user import User

class UserRepository(ABC):

    def __init__(self, dbSession) -> None:
        super().__init__()
        self.dbSession = dbSession

    @abstractmethod
    async def find_by_username(self, username) -> User:
        pass
    
