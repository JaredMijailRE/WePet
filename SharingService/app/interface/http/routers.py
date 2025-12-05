from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import uuid
from app.adapter.db.database import get_db
from app.adapter.db.emotional_repository_sql import SQLEmotionalRepository
from app.application.dto.emotion_dto import CreateEmotionDTO, EmotionResponseDTO
from app.application.usecases.manage_emotions import ManageEmotionsUseCase
from app.adapter.auth.dependencies import get_current_user_id

router = APIRouter()

# Endpoint para REPORTAR (POST)
@router.post("/mood", response_model=List[EmotionResponseDTO])
def register_mood(
    data: CreateEmotionDTO,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    repo = SQLEmotionalRepository(db)
    use_case = ManageEmotionsUseCase(repo)
    return use_case.register_mood(uuid.UUID(user_id), data)

# Endpoint para VER (GET Dashboard)
@router.get("/mood/group/{group_id}", response_model=List[EmotionResponseDTO])
def get_group_moods(
    group_id: str,
    db: Session = Depends(get_db)
):
    repo = SQLEmotionalRepository(db)
    use_case = ManageEmotionsUseCase(repo)
    return use_case.get_group_moodboard(uuid.UUID(group_id))