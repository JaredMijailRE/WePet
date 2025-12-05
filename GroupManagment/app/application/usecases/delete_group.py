import uuid
from fastapi import HTTPException
from app.domain.repositories.group_repository import GroupRepository

class DeleteGroupUseCase:
    def __init__(self, repository: GroupRepository):
        self.repository = repository

    def execute(self, group_id: uuid.UUID):
        success = self.repository.delete(group_id)
        if not success:
            raise HTTPException(status_code=404, detail="Group not found")

        return {"message": "Group deleted successfully"}
