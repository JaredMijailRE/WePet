from sqlalchemy.orm import Session
from app.domain.repositories.group_repository import GroupRepository
from app.domain.entities.group import Group
from app.domain.entities.activity import Activity
# Ajusta este import según dónde tengas models.py (ej: app.adapter.db.models)
from app.adapter.db.models import Group as GroupModel, GroupMember, Activity as ActivityModel
import uuid
from typing import List

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

    def find_by_id(self, group_id: uuid.UUID) -> Group | None:
        db_group = self.db.query(GroupModel).filter(GroupModel.id == group_id).first()
        if db_group:
            return Group(id=db_group.id, name=db_group.name, invite_code=db_group.invite_code)
        return None

    def find_by_invite_code(self, code: str) -> Group | None:
        db_group = self.db.query(GroupModel).filter(GroupModel.invite_code == code).first()
        if db_group:
            return Group(id=db_group.id, name=db_group.name, invite_code=db_group.invite_code)
        return None

    def update_name(self, group_id: uuid.UUID, name: str) -> Group | None:
        db_group = self.db.query(GroupModel).filter(GroupModel.id == group_id).first()
        if db_group:
            db_group.name = name
            self.db.commit()
            self.db.refresh(db_group)
            return Group(id=db_group.id, name=db_group.name, invite_code=db_group.invite_code)
        return None

    def delete(self, group_id: uuid.UUID) -> bool:
        db_group = self.db.query(GroupModel).filter(GroupModel.id == group_id).first()
        if db_group:
            self.db.delete(db_group)
            self.db.commit()
            return True
        return False

    def add_member(self, group_id: uuid.UUID, user_id: uuid.UUID, role: str):
        member = GroupMember(
            group_id=group_id,
            user_id=user_id,
            role=role
        )
        self.db.add(member)
        self.db.commit()

    def get_member(self, group_id: uuid.UUID, user_id: uuid.UUID):
        return self.db.query(GroupMember).filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id == user_id
        ).first()

    def list_members(self, group_id: uuid.UUID):
        return self.db.query(GroupMember).filter(GroupMember.group_id == group_id).all()

    def update_member(self, group_id: uuid.UUID, user_id: uuid.UUID, role=None, is_sharing_location_with_group=None, has_notifications_enabled=None):
        member = self.get_member(group_id, user_id)
        if member:
            if role is not None:
                member.role = role
            if is_sharing_location_with_group is not None:
                member.is_sharing_location_with_group = is_sharing_location_with_group
            if has_notifications_enabled is not None:
                member.has_notifications_enabled = has_notifications_enabled
            self.db.commit()
            self.db.refresh(member)
            return member
        return None

    def remove_member(self, group_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        member = self.get_member(group_id, user_id)
        if member:
            self.db.delete(member)
            self.db.commit()
            return True
        return False

    def is_member(self, group_id: uuid.UUID, user_id: uuid.UUID) -> bool:
        member = self.db.query(GroupMember).filter(
            GroupMember.group_id == group_id,
            GroupMember.user_id == user_id
        ).first()
        return member is not None

    def save_activity(self, activity: Activity) -> Activity:
        db_activity = ActivityModel(
            id=activity.id,
            group_id=activity.group_id,
            title=activity.title,
            description=activity.description,
            start_date=activity.start_date,
            end_date=activity.end_date,
            xp_reward=activity.xp_reward,
            status=activity.status
        )
        self.db.add(db_activity)
        self.db.commit()
        self.db.refresh(db_activity)
        return activity

    def find_activity_by_id(self, activity_id: uuid.UUID) -> Activity | None:
        db_activity = self.db.query(ActivityModel).filter(ActivityModel.id == activity_id).first()
        if db_activity:
            return Activity(
                id=db_activity.id,
                group_id=db_activity.group_id,
                title=db_activity.title,
                description=db_activity.description,
                start_date=db_activity.start_date,
                end_date=db_activity.end_date,
                xp_reward=db_activity.xp_reward,
                status=db_activity.status,
                created_at=db_activity.created_at
            )
        return None

    def list_activities_by_group(self, group_id: uuid.UUID) -> List[Activity]:
        db_activities = self.db.query(ActivityModel).filter(ActivityModel.group_id == group_id).all()
        return [
            Activity(
                id=db_activity.id,
                group_id=db_activity.group_id,
                title=db_activity.title,
                description=db_activity.description,
                start_date=db_activity.start_date,
                end_date=db_activity.end_date,
                xp_reward=db_activity.xp_reward,
                status=db_activity.status,
                created_at=db_activity.created_at
            )
            for db_activity in db_activities
        ]

    def update_activity(self, activity_id: uuid.UUID, title=None, description=None, start_date=None, end_date=None, xp_reward=None, status=None) -> Activity | None:
        db_activity = self.db.query(ActivityModel).filter(ActivityModel.id == activity_id).first()
        if db_activity:
            if title is not None:
                db_activity.title = title
            if description is not None:
                db_activity.description = description
            if start_date is not None:
                db_activity.start_date = start_date
            if end_date is not None:
                db_activity.end_date = end_date
            if xp_reward is not None:
                db_activity.xp_reward = xp_reward
            if status is not None:
                db_activity.status = status
            self.db.commit()
            self.db.refresh(db_activity)
            return Activity(
                id=db_activity.id,
                group_id=db_activity.group_id,
                title=db_activity.title,
                description=db_activity.description,
                start_date=db_activity.start_date,
                end_date=db_activity.end_date,
                xp_reward=db_activity.xp_reward,
                status=db_activity.status,
                created_at=db_activity.created_at
            )
        return None

    def delete_activity(self, activity_id: uuid.UUID) -> bool:
        db_activity = self.db.query(ActivityModel).filter(ActivityModel.id == activity_id).first()
        if db_activity:
            self.db.delete(db_activity)
            self.db.commit()
            return True
        return False