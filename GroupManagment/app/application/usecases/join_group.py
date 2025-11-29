import uuid
from fastapi import HTTPException
from app.domain.repositories.group_repository import GroupRepository
from app.adapter.db.models import Role

class JoinGroupUseCase:
    def __init__(self, repository: GroupRepository):
        self.repository = repository

    def execute(self, invite_code: str, user_id: uuid.UUID):
        # Buscar grupo por código
        group = self.repository.find_by_invite_code(invite_code)
        if not group:
            raise HTTPException(status_code=404, detail="Código de invitación inválido")

        # Verificar si ya es miembro
        if self.repository.is_member(group.id, user_id):
            raise HTTPException(status_code=400, detail="Ya eres miembro de este grupo")

        # Agregar como MIEMBRO
        self.repository.add_member(group.id, user_id, Role.MEMBER)

        return {"message": f"Te has unido exitosamente al grupo {group.name}"}