from .models import Group, GroupMember, Activity, Role, ActivityStatus
import uuid
from datetime import datetime
from sqlalchemy.orm import Session



# ============================================================
# GROUP CRUD
# ============================================================

def create_group(db: Session, name: str) -> Group:
    new_group = Group(
        name=name,
        invite_code=str(uuid.uuid4())[:8]  # IDK if this is valid actually
    )
    db.add(new_group)
    db.commit()
    db.refresh(new_group)
    return new_group

def get_group(db: Session, group_id: uuid.UUID) -> Group | None:
    return db.query(Group).filter(Group.id == group_id).first()

def get_group_by_invite_code(db: Session, invite_code: str) -> Group | None:
    return db.query(Group).filter(Group.invite_code == invite_code).first()

# I don't think this is useful... 
def list_groups(db: Session, skip: int = 0, limit: int = 50):
    return db.query(Group).offset(skip).limit(limit).all()

def update_group_name(db: Session, group_id: uuid.UUID, *, name: str | None = None):
    group = get_group(db, group_id)
    if not group:
        return None

    if name is not None:
        group.name = name

    db.commit()
    db.refresh(group)
    return group

def delete_group(db: Session, group_id: uuid.UUID) -> bool:
    group = get_group(db, group_id)
    if not group:
        return False

    db.delete(group)
    db.commit()
    return True



# ============================================================
# GROUP MEMBERS CRUD
# ============================================================

def add_member_to_group(db: Session, group_id: uuid.UUID, user_id: uuid.UUID, role: Role = Role.MEMBER):
    new_member = GroupMember(group_id=group_id, user_id=user_id, role=role)
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member

def get_group_member(db: Session, group_id: uuid.UUID, user_id: uuid.UUID) -> GroupMember | None:
    return (db.query(GroupMember).filter(GroupMember.group_id == group_id, GroupMember.user_id == user_id).first())

def list_group_members(db: Session, group_id: uuid.UUID):
    return (db.query(GroupMember).filter(GroupMember.group_id == group_id).all())

def update_group_member(db: Session, group_id: uuid.UUID, user_id: uuid.UUID, *, role: Role | None = None, 
    is_sharing_location_with_group: bool | None = None, has_notifications_enabled: bool | None = None):

    member = get_group_member(db, group_id, user_id)
    if not member:
        return None

    if role is not None:
        member.role = role
    if is_sharing_location_with_group is not None:
        member.is_sharing_location_with_group = (
            is_sharing_location_with_group
        )
    if has_notifications_enabled is not None:
        member.has_notifications_enabled = (
            has_notifications_enabled
        )

    db.commit()
    db.refresh(member)
    return member


def remove_member_from_group(db: Session, group_id: uuid.UUID, user_id: uuid.UUID) -> bool:

    member = get_group_member(db, group_id, user_id)
    if not member:
        return False

    db.delete(member)
    db.commit()
    return True



# ============================================================
# ACTIVITIES CRUD
# ============================================================

def create_activity(db: Session, group_id: uuid.UUID, title: str, description: str | None, start_date: datetime,
    end_date: datetime, xp_reward: int, status: ActivityStatus = ActivityStatus.ACTIVE):

    new_activity = Activity(group_id=group_id, title=title, description=description, start_date=start_date,
        end_date=end_date, xp_reward=xp_reward, status=status)
    
    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)
    return new_activity

def get_activity(db: Session, activity_id: uuid.UUID) -> Activity | None:
    return db.query(Activity).filter(Activity.id == activity_id).first()

def list_activities(db: Session, group_id: uuid.UUID):
    return (db.query(Activity).filter(Activity.group_id == group_id).all())


def update_activity(db: Session, activity_id: uuid.UUID, *, title: str | None = None, description: str | None = None,
    start_date: datetime | None = None, end_date: datetime | None = None, xp_reward: int | None = None, status: ActivityStatus | None = None):
    
    activity = get_activity(db, activity_id)
    if not activity:
        return None

    if title is not None:
        activity.title = title
    if description is not None:
        activity.description = description
    if start_date is not None:
        activity.start_date = start_date
    if end_date is not None:
        activity.end_date = end_date
    if xp_reward is not None:
        activity.xp_reward = xp_reward
    if status is not None:
        activity.status = status

    db.commit()
    db.refresh(activity)
    return activity


def delete_activity(db: Session, activity_id: uuid.UUID) -> bool:
    activity = get_activity(db, activity_id)
    if not activity:
        return False

    db.delete(activity)
    db.commit()
    return True
