from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import uuid
from app.adapter.db.database import get_db
from app.adapter.db.group_repository_sql import SQLGroupRepository
from app.application.dto.group_dto import GroupCreateDTO, JoinGroupDTO, GroupResponseDTO
from app.application.usecases.create_group import CreateGroupUseCase
from app.application.usecases.join_group import JoinGroupUseCase
from app.adapter.auth.dependencies import get_current_user_id

router = APIRouter()

@router.post("/", response_model=GroupResponseDTO)
def create_group(
    group_data: GroupCreateDTO,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    repo = SQLGroupRepository(db)
    use_case = CreateGroupUseCase(repo)
    return use_case.execute(group_data, uuid.UUID(user_id))

@router.post("/join")
def join_group(
    join_data: JoinGroupDTO,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    repo = SQLGroupRepository(db)
    use_case = JoinGroupUseCase(repo)
    return use_case.execute(join_data.invite_code, uuid.UUID(user_id))