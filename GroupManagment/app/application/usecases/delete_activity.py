import uuid
from fastapi import HTTPException
from app.domain.repositories.group_repository import GroupRepository

class DeleteActivityUseCase:
    def __init__(self, repository: GroupRepository):
        self.repository = repository

    def execute(self, activity_id: uuid.UUID):
        success = self.repository.delete_activity(activity_id)
        if not success:
            raise HTTPException(status_code=404, detail="Activity not found")

        return {"message": "Activity deleted successfully"}
