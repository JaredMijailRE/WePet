from typing import List
from app.domain.repositories.user_repository import UserRepository
from app.application.dto.user_dto import UserDTO
import uuid

class GetUsersByIds:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def execute(self, user_ids: List[uuid.UUID]) -> List[UserDTO]:
        users = self.user_repository.find_by_ids(user_ids)

        return [
            UserDTO(
                id=user.id,
                username=user.username,
                email=user.email,
                birth_date=user.birth_date,
                current_emotional_status=user.current_emotional_status,
                its_sharing_location=user.its_sharing_location,
                created_at=user.created_at
            )
            for user in users
        ]
