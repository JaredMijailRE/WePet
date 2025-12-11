from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import uuid
from app.adapter.db.database import get_db
from app.adapter.db.pet_repository_sql import SQLPetRepository
from app.application.dto.pet_dto import PetCreateDTO, PetResponseDTO, PetNameUpdateDTO
from app.application.usecases.create_pet import CreatePetUseCase
from app.application.usecases.get_group_pet import GetGroupPetUseCase
from app.application.usecases.feed_pet import FeedPetUseCase
from app.application.usecases.clean_pet import CleanPetUseCase
from app.application.usecases.name_pet import NamePetUseCase

router = APIRouter()

@router.post(
    "/", 
    response_model=PetResponseDTO,
    summary="Create a new pet",
    description="Creates a new pet for a specific group."
)
def create_pet(pet_data: PetCreateDTO, db: Session = Depends(get_db)):
    repo = SQLPetRepository(db)
    use_case = CreatePetUseCase(repo)
    return use_case.execute(pet_data)

@router.get(
    "/{group_id}", 
    response_model=PetResponseDTO,
    summary="Get group pet",
    description="Obtains data from the pet belonging to the specified group."
)
def get_group_pet(group_id: uuid.UUID, db: Session = Depends(get_db)):
    repo = SQLPetRepository(db)
    use_case = GetGroupPetUseCase(repo)
    return use_case.execute(group_id)

@router.post(
    "/{group_id}/feed", 
    response_model=PetResponseDTO,
    summary="Feed the pet",
    description="Feeds the pet of the specified group."
)
def feed_pet(group_id: uuid.UUID, db: Session = Depends(get_db)):
    repo = SQLPetRepository(db)
    use_case = FeedPetUseCase(repo)
    return use_case.execute(group_id)

@router.post(
    "/{group_id}/clean", 
    response_model=PetResponseDTO,
    summary="Clean the pet",
    description="Cleans the pet of the specified group."
)
def clean_pet(group_id: uuid.UUID, db: Session = Depends(get_db)):
    repo = SQLPetRepository(db)
    use_case = CleanPetUseCase(repo)
    return use_case.execute(group_id)

@router.put(
    "/{group_id}/name", 
    response_model=PetResponseDTO,
    summary="Update pet name",
    description="Updates the name of the pet for the specified group."
)
def name_pet(group_id: uuid.UUID, data: PetNameUpdateDTO, db: Session = Depends(get_db)):
    repo = SQLPetRepository(db)
    use_case = NamePetUseCase(repo)
    return use_case.execute(group_id, data.name)
