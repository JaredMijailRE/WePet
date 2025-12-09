from app.domain.repositories.pet_repository import PetRepository
from app.domain.entities.pet import Pet, PetType
import uuid

class GetMyPetUseCase:
    def __init__(self, repository: PetRepository):
        self.repository = repository

    def execute(self) -> Pet:
        pet = self.repository.find_one()
        if not pet:
            # Create a default pet for the demo
            pet = Pet(
                id=uuid.uuid4(),
                group_id=uuid.uuid4(),
                name="My Pet",
                type=PetType.DOG,
                hunger_level=50, # Start half hungry so feed works
                hygiene_level=50
            )
            return self.repository.save(pet)
        return pet

