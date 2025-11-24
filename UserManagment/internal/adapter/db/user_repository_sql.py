from sqlalchemy.orm import Session
from domain.repositories.user_repository import UserRepository
from domain.entities.user import User
from internal.adapter.db.crud import get_user_by_username
from internal.adapter.db.database import get_db

class SQLUserRepository(UserRepository):

    def __init__(self, dbSession: Session) -> None:
        super().__init__(dbSession)

    async def find_by_username(self, username):
        db = next(get_db())
        try:
            user_db = get_user_by_username(db, username)
            return User(id=user_db.id, hashed_password=user_db.password_hash) if user_db else None
        finally:
            db.close()
