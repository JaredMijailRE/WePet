import uuid
from fastapi import HTTPException
from app.domain.repositories.group_repository import GroupRepository

class RemoveGroupMemberUseCase:
    def __init__(self, repository: GroupRepository):
        self.repository = repository

    def execute(self, group_id: uuid.UUID, user_id: uuid.UUID):
        # Check if group exists
        group = self.repository.find_by_id(group_id)
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")

        # Check if user is a member
        if not self.repository.is_member(group_id, user_id):
            raise HTTPException(status_code=404, detail="User is not a member of this group")

        success = self.repository.remove_member(group_id, user_id)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to remove member")

        return {"message": "Member removed successfully"}
