from fastapi import APIRouter, Depends
from application.dto.auth_dto import LoginDTO
from internal.adapter.db.database import get_db
from internal.application.usecases.user_login import LoginUser
from internal.adapter.db.user_repository_sql import SQLUserRepository
from domain.services.token_service import JWTTokenGenerator


def get_auth_router() -> APIRouter:
    router = APIRouter()
    tokenService = JWTTokenGenerator("jwtSecretKey")

    @router.post("/login")
    async def login(data: LoginDTO, db = Depends(get_db)):
        userRepository = SQLUserRepository(db)
        
        useCaseUserLogin = LoginUser(userRepository, tokenService)
        return useCaseUserLogin.execute(data.username, data.password)

    @router.post("/register")
    async def register():
        return {"message": "Register endpoint"}

    return router