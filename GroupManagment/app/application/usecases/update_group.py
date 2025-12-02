import uuid
from fastapi import HTTPException
from app.domain.repositories.group_repository import GroupRepository
from app.application.dto.group_dto import GroupUpdateDTO, GroupResponseDTO

class UpdateGroupUseCase:
    def __init__(self, repository: GroupRepository):
        self.repository = repository

    def execute(self, group_id: uuid.UUID, data: GroupUpdateDTO) -> GroupResponseDTO:
        if not data.name:
            raise HTTPException(status_code=400, detail="Name is required for update")

        group = self.repository.update_name(group_id, data.name)
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")

        return GroupResponseDTO(
            id=group.id,
            name=group.name,
            invite_code=group.invite_code
        )