import uuid
from fastapi import HTTPException
from app.domain.repositories.group_repository import GroupRepository
from app.application.dto.group_dto import GroupMemberUpdateDTO, GroupMemberDTO

class UpdateGroupMemberUseCase:
    def __init__(self, repository: GroupRepository):
        self.repository = repository

    def execute(self, group_id: uuid.UUID, user_id: uuid.UUID, data: GroupMemberUpdateDTO) -> GroupMemberDTO:
        # Check if group exists
        group = self.repository.find_by_id(group_id)
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")

        # Check if user is a member
        if not self.repository.is_member(group_id, user_id):
            raise HTTPException(status_code=404, detail="User is not a member of this group")

        member = self.repository.update_member(
            group_id=group_id,
            user_id=user_id,
            role=data.role,
            is_sharing_location_with_group=data.is_sharing_location_with_group,
            has_notifications_enabled=data.has_notifications_enabled
        )

        if not member:
            raise HTTPException(status_code=404, detail="Member not found")

        return GroupMemberDTO(
            group_id=member.group_id,
            user_id=member.user_id,
            role=member.role,
            is_sharing_location_with_group=member.is_sharing_location_with_group,
            has_notifications_enabled=member.has_notifications_enabled,
            joined_at=member.joined_at
        )
