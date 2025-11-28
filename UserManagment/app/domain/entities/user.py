from datetime import date
class User:
    def __init__(self, id, username, email, password_hash, birth_date, is_active=True) -> None:
        self.id = id
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.birth_date = birth_date
        self.is_active = is_active

