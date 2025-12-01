import uuid
from fastapi import HTTPException
from app.domain.repositories.group_repository import GroupRepository
from app.application.dto.group_dto import GroupMemberDTO
from typing import List

class ListGroupMembersUseCase:
    def __init__(self, repository: GroupRepository):
        self.repository = repository

    def execute(self, group_id: uuid.UUID) -> List[GroupMemberDTO]:
        # Check if group exists
        group = self.repository.find_by_id(group_id)
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")

        members = self.repository.list_members(group_id)
        return [
            GroupMemberDTO(
                group_id=member.group_id,
                user_id=member.user_id,
                role=member.role,
                is_sharing_location_with_group=member.is_sharing_location_with_group,
                has_notifications_enabled=member.has_notifications_enabled,
                joined_at=member.joined_at
            )
            for member in members
        ]
