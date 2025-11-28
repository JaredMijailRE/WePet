import jwt
from datetime import datetime, timedelta, timezone
import uuid
from app.domain.repositories.token_generator_repository import TokenGenRepository

class JWTTokenGenerator(TokenGenRepository):

    def __init__(self, secret_key: str, algorithm: str = "HS256"):
        self.secret_key = secret_key
        self.algorithm = algorithm

    def generateToken(self, user_id: uuid.UUID) -> str:
        payload = {
            "sub": str(user_id),
            "exp": datetime.now(timezone.utc) + timedelta(minutes=60)
        }
        return jwt.encode(payload, self.secret_key, algorithm=self.algorithm)