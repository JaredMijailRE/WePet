import uuid
from app.domain.repositories.group_repository import GroupRepository
from app.application.dto.group_dto import GroupResponseDTO
from typing import List

class ListUserGroupsUseCase:
    def __init__(self, repository: GroupRepository):
        self.repository = repository

    def execute(self, user_id: uuid.UUID) -> List[GroupResponseDTO]:
        groups = self.repository.find_groups_by_user_id(user_id)

        return [
            GroupResponseDTO(
                id=group.id,
                name=group.name,
                invite_code=group.invite_code
            )
            for group in groups
        ]

