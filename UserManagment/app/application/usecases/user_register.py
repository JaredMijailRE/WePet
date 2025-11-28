from fastapi import HTTPException
from app.domain.repositories.user_repository import UserRepository
from app.application.dto.user_dto import UserCreate, UserResponse
from app.adapter.security import get_password_hash
from app.domain.entities.user import User

class RegisterUser:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, user_in: UserCreate) -> UserResponse:
        if self.user_repository.find_by_username(user_in.username):
            raise HTTPException(status_code=400, detail="Username already exists")
        if self.user_repository.find_by_email(user_in.email):
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_pwd = get_password_hash(user_in.password)

        new_user = User(
            id=None, 
            username=user_in.username, 
            email=user_in.email, 
            password_hash=hashed_pwd,
            birth_date=user_in.birth_date
        )

        saved_user = self.user_repository.save(new_user)
        
        return UserResponse(
            id=saved_user.id,
            username=saved_user.username,
            email=saved_user.email
        )