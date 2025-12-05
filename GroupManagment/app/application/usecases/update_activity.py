import uuid
from fastapi import HTTPException
from app.domain.repositories.group_repository import GroupRepository
from app.application.dto.group_dto import ActivityUpdateDTO, ActivityResponseDTO

class UpdateActivityUseCase:
    def __init__(self, repository: GroupRepository):
        self.repository = repository

    def execute(self, activity_id: uuid.UUID, data: ActivityUpdateDTO) -> ActivityResponseDTO:
        activity = self.repository.update_activity(
            activity_id=activity_id,
            title=data.title,
            description=data.description,
            start_date=data.start_date,
            end_date=data.end_date,
            xp_reward=data.xp_reward,
            status=data.status
        )

        if not activity:
            raise HTTPException(status_code=404, detail="Activity not found")

        return ActivityResponseDTO(
            id=activity.id,
            group_id=activity.group_id,
            title=activity.title,
            description=activity.description,
            start_date=activity.start_date,
            end_date=activity.end_date,
            xp_reward=activity.xp_reward,
            status=activity.status,
            created_at=activity.created_at
        )
