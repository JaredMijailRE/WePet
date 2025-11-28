from domain.repositories.token_generator_repository import TokenGenRepository


class JWTTokenGenerator(TokenGenRepository):

    def generateToken(self, user_id: int) -> str:
        return ""
