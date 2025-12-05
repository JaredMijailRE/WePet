import uuid
from fastapi import HTTPException
from app.domain.repositories.group_repository import GroupRepository
from app.application.dto.group_dto import GroupResponseDTO

class GetGroupUseCase:
    def __init__(self, repository: GroupRepository):
        self.repository = repository

    def execute(self, group_id: uuid.UUID) -> GroupResponseDTO:
        group = self.repository.find_by_id(group_id)
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")

        return GroupResponseDTO(
            id=group.id,
            name=group.name,
            invite_code=group.invite_code
        )
