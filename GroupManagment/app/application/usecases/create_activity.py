import uuid
from fastapi import HTTPException
from app.domain.repositories.group_repository import GroupRepository
from app.domain.entities.activity import Activity
from app.application.dto.group_dto import ActivityCreateDTO, ActivityResponseDTO

class CreateActivityUseCase:
    def __init__(self, repository: GroupRepository):
        self.repository = repository

    def execute(self, data: ActivityCreateDTO) -> ActivityResponseDTO:
        # Check if group exists
        group = self.repository.find_by_id(data.group_id)
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")

        # Create activity entity
        activity = Activity(
            id=uuid.uuid4(),
            group_id=data.group_id,
            title=data.title,
            description=data.description,
            start_date=data.start_date,
            end_date=data.end_date,
            xp_reward=data.xp_reward,
            status=data.status,
            created_at=None  # Will be set by database
        )

        # Save activity
        saved_activity = self.repository.save_activity(activity)

        # Get the saved activity with created_at timestamp
        db_activity = self.repository.find_activity_by_id(saved_activity.id)

        return ActivityResponseDTO(
            id=db_activity.id,
            group_id=db_activity.group_id,
            title=db_activity.title,
            description=db_activity.description,
            start_date=db_activity.start_date,
            end_date=db_activity.end_date,
            xp_reward=db_activity.xp_reward,
            status=db_activity.status,
            created_at=db_activity.created_at
        )
