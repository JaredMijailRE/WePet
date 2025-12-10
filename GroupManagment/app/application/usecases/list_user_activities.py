import uuid
from app.domain.repositories.group_repository import GroupRepository
from app.application.dto.group_dto import UserActivityResponseDTO
from typing import List

class ListUserActivitiesUseCase:
    def __init__(self, repository: GroupRepository):
        self.repository = repository

    def execute(self, user_id: uuid.UUID) -> List[UserActivityResponseDTO]:
        activities = self.repository.list_activities_by_user(user_id)

        return [
            UserActivityResponseDTO(
                id=activity.id,
                group_id=activity.group_id,
                group_name=activity.group_name,
                title=activity.title,
                description=activity.description,
                start_date=activity.start_date,
                end_date=activity.end_date,
                xp_reward=activity.xp_reward,
                status=activity.status,
                created_at=activity.created_at
            )
            for activity in activities
        ]