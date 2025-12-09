from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.adapter.db.database import get_db
from app.adapter.db.pet_repository_sql import SQLPetRepository
from app.application.dto.pet_dto import PetResponseDTO, PetNameUpdateDTO
from app.application.usecases.get_my_pet import GetMyPetUseCase
from app.application.usecases.feed_pet import FeedPetUseCase
from app.application.usecases.clean_pet import CleanPetUseCase
from app.application.usecases.name_pet import NamePetUseCase

router = APIRouter()

@router.get(
    "/my", 
    response_model=PetResponseDTO,
    summary="Get my pet",
    description="Obtains data from the current pet. If no pet exists, a default one is created."
)
def get_my_pet(db: Session = Depends(get_db)):
    repo = SQLPetRepository(db)
    use_case = GetMyPetUseCase(repo)
    return use_case.execute()

@router.post(
    "/feed", 
    response_model=PetResponseDTO,
    summary="Feed the pet",
    description="Feeds the pet, decreasing hunger and increasing XP. Requires an existing pet."
)
def feed_pet(db: Session = Depends(get_db)):
    repo = SQLPetRepository(db)
    use_case = FeedPetUseCase(repo)
    return use_case.execute()

@router.post(
    "/clean", 
    response_model=PetResponseDTO,
    summary="Clean the pet",
    description="Cleans the pet, improving hygiene and increasing XP. Requires an existing pet."
)
def clean_pet(db: Session = Depends(get_db)):
    repo = SQLPetRepository(db)
    use_case = CleanPetUseCase(repo)
    return use_case.execute()

@router.put(
    "/name", 
    response_model=PetResponseDTO,
    summary="Update pet name",
    description="Updates the name of the current pet."
)
def name_pet(data: PetNameUpdateDTO, db: Session = Depends(get_db)):
    repo = SQLPetRepository(db)
    use_case = NamePetUseCase(repo)
    return use_case.execute(data.name)
