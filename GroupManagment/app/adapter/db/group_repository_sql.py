from sqlalchemy.orm import Session
from app.domain.repositories.group_repository import GroupRepository
from app.domain.entities.group import Group
# Ajusta este import según dónde tengas models.py (ej: app.adapter.db.models)
from app.adapter.db.models import Group as GroupModel, GroupMember, Role
import uuid

class SQLGroupRepository(GroupRepository):
    def __init__(self, db: Session):
        self.db = db

    def save(self, group: Group) -> Group:
        db_group = GroupModel(
            id=group.id,
            name=group.name,
            invite_code=group.invite_code
        )
        self.db.add(db_group)
        self.db.commit()
        self.db.refresh(db_group)
        return group

    def find_by_invite_code(self, code: str) -> Group | None:
        db_group = self.db.query(GroupModel).filter(GroupModel.invite_code == code).first()
        if db_group:
            return Group(id=db_group.id, name=db_group.name, invite_code=db_group.invite_code)
        return None

    def add_member(self, group_id: uuid.UUID, user_id: uuid.UUID, role: str):
        member = GroupMember(
            group_id=group_id,
            user_id=user_id,
            role=role
        )
        self.db.add(member)
        self.db.commit()

    def is_member(self, group_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        member = self.db.query(GroupMember).filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id == user_id
        ).first()
        return member is not None