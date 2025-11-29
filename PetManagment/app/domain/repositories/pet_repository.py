from abc import ABC, abstractmethod
from app.domain.entities.pet import Pet
import uuid

class PetRepository(ABC):
    @abstractmethod
    def save(self, pet: Pet) -> Pet:
        pass

    @abstractmethod
    def find_by_group_id(self, group_id: uuid.UUID) -> Pet | None:
        pass