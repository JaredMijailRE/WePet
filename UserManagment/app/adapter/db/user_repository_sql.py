from sqlalchemy.orm import Session
from typing import List
from domain.repositories.user_repository import UserRepository
from app.domain.entities.user import User as UserEntity
from app.adapter.db.models import User as UserModel
import uuid

class SQLUserRepository(UserRepository):

    def __init__(self, dbSession: Session):
        self.db = dbSession

    def find_by_username(self, username: str) -> UserEntity | None:
        user_db = self.db.query(UserModel).filter(UserModel.username == username).first()
        return self._map_to_entity(user_db) if user_db else None

    def find_by_email(self, email: str) -> UserEntity | None:
        user_db = self.db.query(UserModel).filter(UserModel.email == email).first()
        return self._map_to_entity(user_db) if user_db else None

    def save(self, user: UserEntity) -> UserEntity:
        new_user_db = UserModel(
            username=user.username,
            email=user.email,
            password_hash=user.password_hash,
            birth_date=user.birth_date
        )
        
        self.db.add(new_user_db)
        self.db.commit()
        self.db.refresh(new_user_db)
        
        return self._map_to_entity(new_user_db)

    def find_by_id(self, user_id: uuid.UUID) -> UserEntity | None:
        user_db = self.db.query(UserModel).filter(UserModel.id == user_id).first()
        return self._map_to_entity(user_db) if user_db else None

    def find_by_ids(self, user_ids: List[uuid.UUID]) -> List[UserEntity]:
        users_db = self.db.query(UserModel).filter(UserModel.id.in_(user_ids)).all()
        return [self._map_to_entity(user_db) for user_db in users_db]

    def _map_to_entity(self, user_db: UserModel) -> UserEntity:
        return UserEntity(
            id=user_db.id,
            username=user_db.username,
            email=user_db.email,
            password_hash=user_db.password_hash,
            birth_date=user_db.birth_date,
            current_emotional_status=user_db.current_emotional_status,
            its_sharing_location=user_db.its_sharing_location,
            created_at=user_db.created_at
        )
    