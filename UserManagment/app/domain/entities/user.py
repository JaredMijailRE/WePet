
from datetime import datetime
from typing import Optional

class User:
    def __init__(self, id, username, email, password_hash, birth_date,
                 current_emotional_status=None, its_sharing_location=False, created_at=None) -> None:
        self.id = id
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.birth_date = birth_date
        self.current_emotional_status = current_emotional_status
        self.its_sharing_location = its_sharing_location
        self.created_at = created_at

