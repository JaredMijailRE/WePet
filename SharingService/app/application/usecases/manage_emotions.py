import uuid
from datetime import datetime, timezone
from typing import List
from app.domain.repositories.emotional_repository import EmotionalRepository
from app.domain.entities.emotional_report import EmotionalReport
from app.application.dto.emotion_dto import CreateEmotionDTO, EmotionResponseDTO

class ManageEmotionsUseCase:
    def __init__(self, repository: EmotionalRepository):
        self.repository = repository

    def register_mood(self, user_id: uuid.UUID, data: CreateEmotionDTO) -> EmotionResponseDTO:
        new_report = EmotionalReport(
            id=uuid.uuid4(),
            user_id=user_id,
            group_id=data.group_id,
            status_name=data.emotion,
            created_at=datetime.now(timezone.utc)
        )
        self.repository.save(new_report)
        
        return EmotionResponseDTO(
            user_id=new_report.user_id,
            emotion=new_report.status_name,
            created_at=new_report.created_at
        )

    def get_group_moodboard(self, group_id: uuid.UUID) -> List[EmotionResponseDTO]:
        reports = self.repository.get_latest_moods_by_group(group_id)
        
        return [
            EmotionResponseDTO(
                user_id=r.user_id,
                emotion=r.status_name,
                created_at=r.created_at
            ) for r in reports
        ]