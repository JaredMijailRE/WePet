from sqlalchemy.orm import Session
from domain.repositories.user_repository import UserRepository
from domain.entities.user import User
from app.adapter.db.crud import get_user_by_username
from app.adapter.db.database import get_db
from app.domain.entities.user import User as UserEntity
from app.adapter.db.models import User as UserModel

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

    def _map_to_entity(self, user_db: UserModel) -> UserEntity:
        return UserEntity(
            id=user_db.id,
            username=user_db.username,
            email=user_db.email,
            password_hash=user_db.password_hash,
            birth_date=user_db.birth_date,
            is_active=True 
        )
    