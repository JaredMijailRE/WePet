import uuid
from fastapi import HTTPException
from app.domain.repositories.group_repository import GroupRepository
from app.application.dto.group_dto import ActivityResponseDTO

class GetActivityUseCase:
    def __init__(self, repository: GroupRepository):
        self.repository = repository

    def execute(self, activity_id: uuid.UUID) -> ActivityResponseDTO:
        activity = self.repository.find_activity_by_id(activity_id)
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
