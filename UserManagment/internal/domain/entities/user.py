class User:
    def __init__(self, id, hashed_password) -> None:
        self.id = id
        self.hashed_password = hashed_password

    def verify_password(self, hash_input_password: str) -> bool:
        return self.hashed_password == hash_input_password