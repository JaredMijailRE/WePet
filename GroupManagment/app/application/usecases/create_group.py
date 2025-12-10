import uuid
import uuid6 
from app.domain.repositories.group_repository import GroupRepository
from app.domain.entities.group import Group
from app.application.dto.group_dto import GroupCreateDTO, GroupResponseDTO
from app.adapter.db.models import Role

class CreateGroupUseCase:
    def __init__(self, repository: GroupRepository):
        self.repository = repository

    def execute(self, data: GroupCreateDTO, user_id: uuid.UUID) -> GroupResponseDTO:
        # Generar ID y Código de Invitación (UUIDv7)
        group_id = uuid.uuid4()
        invite_code = str(group_id)[0:6]

        new_group = Group(id=group_id, name=data.name, invite_code=invite_code)

        # Guardar Grupo
        self.repository.save(new_group)

        # Asignar al creador como ADMIN
        self.repository.add_member(group_id, user_id, Role.ADMIN)

        return GroupResponseDTO(
            id=new_group.id,
            name=new_group.name,
            invite_code=new_group.invite_code
        )