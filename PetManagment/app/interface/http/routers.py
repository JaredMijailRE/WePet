from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.adapter.db.database import get_db
from app.adapter.db.pet_repository_sql import SQLPetRepository
from app.application.dto.pet_dto import PetCreateDTO, PetResponseDTO
from app.application.usecases.create_pet import CreatePetUseCase

router = APIRouter()

@router.post("/", response_model=PetResponseDTO)
def create_pet(pet_data: PetCreateDTO, db: Session = Depends(get_db)):
    repo = SQLPetRepository(db)
    use_case = CreatePetUseCase(repo)
    return use_case.execute(pet_data)