from fastapi import HTTPException
from domain.repositories.user_repository import UserRepository
from domain.repositories.token_generator_repository import TokenGenRepository
from app.adapter.security import verify_password

class LoginUser:
    def __init__(self, user_repository: UserRepository,  token_service: TokenGenRepository):
        self.user_repository = user_repository
        self.token_service = token_service

    def execute(self, username: str, password: str):
        user = self.user_repository.find_by_username(username)
        if not user:
            user = self.user_repository.find_by_email(username)

        if not user:
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

        if not verify_password(password, user.password_hash):
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
        
        token = self.token_service.generateToken(user.id)

        return {"access_token": token, "token_type": "bearer"}