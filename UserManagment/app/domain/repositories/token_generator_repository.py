from abc import ABC, abstractmethod
import uuid

class TokenGenRepository(ABC):

    @abstractmethod
    def generateToken(self, user_id: uuid.UUID) -> str:
        pass
    
