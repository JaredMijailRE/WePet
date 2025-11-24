from domain.entities.user import User
from domain.repositories.user_repository import UserRepository
from domain.repositories.token_generator_repository import TokenGenRepository

class LoginUser:
    def __init__(self, user_repository: UserRepository,  token_service: TokenGenRepository):
        self.user_repository = user_repository
        self.token_service = token_service

    async def execute(self, username, password):
        user: User = await self.user_repository.find_by_username(username)

        if not user:
            raise ValueError("Usuario no encontrado")

        if not user.verify_password(password):
            raise ValueError("Contraseña incorrecta")
        
        token = self.token_service.generateToken(user.id)

        return {"message": "Login exitoso", 
                "user_token": token}
