from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import uuid
from app.adapter.db.database import get_db
from app.adapter.db.group_repository_sql import SQLGroupRepository
from app.application.dto.group_dto import (
    GroupCreateDTO, JoinGroupDTO, GroupResponseDTO, GroupUpdateDTO,
    GroupMemberDTO, GroupMemberUpdateDTO, ActivityCreateDTO, ActivityUpdateDTO, ActivityResponseDTO
)
from app.application.usecases.create_group import CreateGroupUseCase
from app.application.usecases.join_group import JoinGroupUseCase
from app.application.usecases.get_group import GetGroupUseCase
from app.application.usecases.update_group import UpdateGroupUseCase
from app.application.usecases.delete_group import DeleteGroupUseCase
from app.application.usecases.list_group_members import ListGroupMembersUseCase
from app.application.usecases.update_group_member import UpdateGroupMemberUseCase
from app.application.usecases.remove_group_member import RemoveGroupMemberUseCase
from app.application.usecases.create_activity import CreateActivityUseCase
from app.application.usecases.get_activity import GetActivityUseCase
from app.application.usecases.list_activities import ListActivitiesUseCase
from app.application.usecases.update_activity import UpdateActivityUseCase
from app.application.usecases.delete_activity import DeleteActivityUseCase
from app.adapter.auth.dependencies import get_current_user_id
from typing import List

router = APIRouter()

# Group CRUD endpoints
@router.post("/", response_model=GroupResponseDTO)
def create_group(
    group_data: GroupCreateDTO,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    repo = SQLGroupRepository(db)
    use_case = CreateGroupUseCase(repo)
    return use_case.execute(group_data, uuid.UUID(user_id))

@router.get("/{group_id}", response_model=GroupResponseDTO)
def get_group(
    group_id: uuid.UUID,
    db: Session = Depends(get_db)
):
    repo = SQLGroupRepository(db)
    use_case = GetGroupUseCase(repo)
    return use_case.execute(group_id)

@router.put("/{group_id}", response_model=GroupResponseDTO)
def update_group(
    group_id: uuid.UUID,
    group_data: GroupUpdateDTO,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    repo = SQLGroupRepository(db)
    use_case = UpdateGroupUseCase(repo)
    return use_case.execute(group_id, group_data)

@router.delete("/{group_id}")
def delete_group(
    group_id: uuid.UUID,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    repo = SQLGroupRepository(db)
    use_case = DeleteGroupUseCase(repo)
    return use_case.execute(group_id)

# Group join endpoint
@router.post("/join")
def join_group(
    join_data: JoinGroupDTO,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    repo = SQLGroupRepository(db)
    use_case = JoinGroupUseCase(repo)
    return use_case.execute(join_data.invite_code, uuid.UUID(user_id))

# Group members endpoints
@router.get("/{group_id}/members", response_model=List[GroupMemberDTO])
def list_group_members(
    group_id: uuid.UUID,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    repo = SQLGroupRepository(db)
    use_case = ListGroupMembersUseCase(repo)
    return use_case.execute(group_id)

@router.put("/{group_id}/members/{member_user_id}", response_model=GroupMemberDTO)
def update_group_member(
    group_id: uuid.UUID,
    member_user_id: uuid.UUID,
    member_data: GroupMemberUpdateDTO,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    repo = SQLGroupRepository(db)
    use_case = UpdateGroupMemberUseCase(repo)
    return use_case.execute(group_id, member_user_id, member_data)

@router.delete("/{group_id}/members/{member_user_id}")
def remove_group_member(
    group_id: uuid.UUID,
    member_user_id: uuid.UUID,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    repo = SQLGroupRepository(db)
    use_case = RemoveGroupMemberUseCase(repo)
    return use_case.execute(group_id, member_user_id)

# Activity endpoints
@router.post("/{group_id}/activities", response_model=ActivityResponseDTO)
def create_activity(
    group_id: uuid.UUID,
    activity_data: ActivityCreateDTO,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    # Override group_id from URL
    activity_data.group_id = group_id
    repo = SQLGroupRepository(db)
    use_case = CreateActivityUseCase(repo)
    return use_case.execute(activity_data)

@router.get("/activities/{activity_id}", response_model=ActivityResponseDTO)
def get_activity(
    activity_id: uuid.UUID,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    repo = SQLGroupRepository(db)
    use_case = GetActivityUseCase(repo)
    return use_case.execute(activity_id)

@router.get("/{group_id}/activities", response_model=List[ActivityResponseDTO])
def list_activities(
    group_id: uuid.UUID,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    repo = SQLGroupRepository(db)
    use_case = ListActivitiesUseCase(repo)
    return use_case.execute(group_id)

@router.put("/activities/{activity_id}", response_model=ActivityResponseDTO)
def update_activity(
    activity_id: uuid.UUID,
    activity_data: ActivityUpdateDTO,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    repo = SQLGroupRepository(db)
    use_case = UpdateActivityUseCase(repo)
    return use_case.execute(activity_id, activity_data)

@router.delete("/activities/{activity_id}")
def delete_activity(
    activity_id: uuid.UUID,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    repo = SQLGroupRepository(db)
    use_case = DeleteActivityUseCase(repo)
    return use_case.execute(activity_id)