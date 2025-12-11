from fastapi import HTTPException
from app.domain.repositories.user_repository import UserRepository
from app.application.dto.user_dto import UserDTO
import uuid

class GetUserById:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, user_id: uuid.UUID) -> UserDTO:
        user = self.user_repository.find_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return UserDTO(
            id=user.id,
            username=user.username,
            email=user.email,
            birth_date=user.birth_date,
            current_emotional_status=user.current_emotional_status,
            its_sharing_location=user.its_sharing_location,
            created_at=user.created_at
        )
