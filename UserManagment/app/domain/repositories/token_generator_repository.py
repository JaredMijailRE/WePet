from abc import ABC, abstractmethod
from domain.entities.user import User

class TokenGenRepository(ABC):

    def __init__(self, secret: str) -> None:
        super().__init__()
        self.secret = secret

    @abstractmethod
    async def generateToken(self, message) -> str:
        pass
    
