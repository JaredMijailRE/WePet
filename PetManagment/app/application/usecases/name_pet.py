from app.domain.repositories.pet_repository import PetRepository
from app.domain.entities.pet import Pet

class NamePetUseCase:
    def __init__(self, repository: PetRepository):
        self.repository = repository

    def execute(self, name: str) -> Pet:
        pet = self.repository.find_one()
        if not pet:
            raise Exception("No pet found. Call /pet/my first to create one.")
        
        pet.update_name(name)
        return self.repository.update(pet)

