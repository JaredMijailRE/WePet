import uuid
from fastapi import HTTPException
from app.domain.repositories.group_repository import GroupRepository
from app.application.dto.group_dto import ActivityResponseDTO
from typing import List

class ListActivitiesUseCase:
    def __init__(self, repository: GroupRepository):
        self.repository = repository

    def execute(self, group_id: uuid.UUID) -> List[ActivityResponseDTO]:
        # Check if group exists
        group = self.repository.find_by_id(group_id)
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")

        activities = self.repository.list_activities_by_group(group_id)
        return [
            ActivityResponseDTO(
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
            for activity in activities
        ]
