from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.adapter.db.database import get_db
from app.adapter.db.user_repository_sql import SQLUserRepository
from app.application.usecases.get_user_by_id import GetUserById
from app.application.usecases.get_users_by_ids import GetUsersByIds
from app.application.dto.user_dto import UserDTO
import uuid

def get_account_manager_router() -> APIRouter:
    router = APIRouter()

    @router.get("/users/{user_id}", response_model=UserDTO)
    async def get_user_by_id(user_id: str, db: Session = Depends(get_db)):
        try:
            user_uuid = uuid.UUID(user_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid user ID format")

        user_repo = SQLUserRepository(db)
        use_case = GetUserById(user_repo)
        return use_case.execute(user_uuid)

    @router.get("/users", response_model=List[UserDTO])
    async def get_users_by_ids(ids: List[str] = Query(...), db: Session = Depends(get_db)):
        try:
            user_uuids = [uuid.UUID(user_id) for user_id in ids]
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid user ID format in ids parameter")

        user_repo = SQLUserRepository(db)
        use_case = GetUsersByIds(user_repo)
        return use_case.execute(user_uuids)

    return router
