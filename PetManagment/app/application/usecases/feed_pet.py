from app.domain.repositories.pet_repository import PetRepository
from app.domain.entities.pet import Pet

class FeedPetUseCase:
    def __init__(self, repository: PetRepository):
        self.repository = repository

    def execute(self) -> Pet:
        pet = self.repository.find_one()
        if not pet:
            # Use GetMyPet logic or raise? 
            # For simplicity, if no pet, we can't feed it. 
            # But in this demo flow, user might call feed first?
            # Let's assume pet exists or raise.
            raise Exception("No pet found. Call /pet/my first to create one.")
        
        pet.feed()
        return self.repository.update(pet)

