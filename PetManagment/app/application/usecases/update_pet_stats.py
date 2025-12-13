from app.domain.repositories.pet_repository import PetRepository
from app.domain.entities.pet import Pet
from fastapi import HTTPException
import uuid

class UpdatePetStatsUseCase:
    def __init__(self, repository: PetRepository):
        self.repository = repository

    def execute(self, group_id: uuid.UUID, hunger_level: int = None, hygiene_level: int = None, 
                health_level: int = None, happiness_level: int = None) -> Pet:
        pet = self.repository.find_by_group_id(group_id)
        if not pet:
            raise HTTPException(status_code=404, detail="Pet not found for this group")
        
        if hunger_level is not None:
            pet.hunger_level = max(0, min(100, hunger_level))
        if hygiene_level is not None:
            pet.hygiene_level = max(0, min(100, hygiene_level))
        if health_level is not None:
            pet.health_level = max(0, min(100, health_level))
        if happiness_level is not None:
            pet.happiness_level = max(0, min(100, happiness_level))
        
        return self.repository.update(pet)

