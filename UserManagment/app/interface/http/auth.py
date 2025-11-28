from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from application.dto.auth_dto import LoginDTO
from app.adapter.db.database import get_db
from app.application.usecases.user_login import LoginUser
from app.adapter.db.user_repository_sql import SQLUserRepository
from app.adapter.auth.jwt_service import JWTTokenGenerator
from app.application.dto.user_dto import UserCreate, UserResponse
from app.application.usecases.user_register import RegisterUser


def get_auth_router() -> APIRouter:
    router = APIRouter()
    tokenService = JWTTokenGenerator("jwtSecretKey")

    @router.post("/login")
    async def login(data: LoginDTO, db = Depends(get_db)):
        userRepository = SQLUserRepository(db)
        
        useCaseUserLogin = LoginUser(userRepository, tokenService)
        return useCaseUserLogin.execute(data.username, data.password)

    @router.post("/register", response_model=UserResponse)
    async def register(user_data: UserCreate, db: Session = Depends(get_db)):
        user_repo = SQLUserRepository(db)
        use_case = RegisterUser(user_repo)
        return use_case.execute(user_data)

    return router