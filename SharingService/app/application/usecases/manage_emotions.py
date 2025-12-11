import uuid
from datetime import datetime, timezone
from typing import List
from app.domain.repositories.emotional_repository import EmotionalRepository
from app.domain.entities.emotional_report import EmotionalReport
from app.application.dto.emotion_dto import CreateEmotionDTO, EmotionResponseDTO

class ManageEmotionsUseCase:
    def __init__(self, repository: EmotionalRepository):
        self.repository = repository

    def register_mood(self, user_id: uuid.UUID, data: CreateEmotionDTO) -> List[EmotionResponseDTO]:
        responses = []
        # current_time = datetime.now(timezone.utc)
        for group_id in data.group_ids:
            new_report = EmotionalReport(
                id=uuid.uuid4(),
                user_id=user_id,
                group_id=group_id,
                status_name=data.emotion,
                created_at=datetime.now(timezone.utc)
            )
            self.repository.save(new_report)
            responses.append(
                EmotionResponseDTO(
                    id=new_report.id,
                    user_id=new_report.user_id,
                    group_id=new_report.group_id,
                    emotion=new_report.status_name,
                    created_at=new_report.created_at
                )
            )
        return responses


    def get_group_moodboard(self, group_id: uuid.UUID) -> List[EmotionResponseDTO]:
        reports = self.repository.get_latest_moods_by_group(group_id)
        
        return [
            EmotionResponseDTO(
                id=r.id,
                group_id=r.group_id,
                user_id=r.user_id,
                emotion=r.status_name,
                created_at=r.created_at
            ) for r in reports
        ]