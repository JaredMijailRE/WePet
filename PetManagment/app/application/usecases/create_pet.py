import uuid
from fastapi import HTTPException
from app.domain.repositories.pet_repository import PetRepository
from app.domain.entities.pet import Pet
from app.application.dto.pet_dto import PetCreateDTO, PetResponseDTO

class CreatePetUseCase:
    def __init__(self, repository: PetRepository):
        self.repository = repository

    def execute(self, data: PetCreateDTO) -> PetResponseDTO:
        # Verifica si el grupo ya tiene mascota
        if self.repository.find_by_group_id(data.group_id):
            raise HTTPException(status_code=400, detail="Este grupo ya tiene una mascota")

        # Crear nueva mascota con stats iniciales
        new_pet = Pet(
            id=uuid.uuid4(),
            group_id=data.group_id,
            name=data.name,
            type=data.type,
            level=1,       
            xp=0,
            hunger_level=100,
            hygiene_level=100,
            health_level=100,
            happiness_level=100
        )

        # Guarda
        self.repository.save(new_pet)

        return PetResponseDTO(
            id=new_pet.id,
            name=new_pet.name,
            type=new_pet.type,
            health_level=new_pet.health_level, 
            happiness_level=new_pet.happiness_level
        )