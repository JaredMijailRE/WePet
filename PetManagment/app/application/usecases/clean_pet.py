from app.domain.repositories.pet_repository import PetRepository
from app.domain.entities.pet import Pet
from fastapi import HTTPException
import uuid

class CleanPetUseCase:
    def __init__(self, repository: PetRepository):
        self.repository = repository

    def execute(self, group_id: uuid.UUID) -> Pet:
        pet = self.repository.find_by_group_id(group_id)
        if not pet:
            raise HTTPException(status_code=404, detail="Pet not found for this group")
        
        pet.clean()
        return self.repository.update(pet)
