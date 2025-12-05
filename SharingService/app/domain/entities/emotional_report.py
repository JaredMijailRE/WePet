import uuid
from dataclasses import dataclass
from datetime import datetime

@dataclass
class EmotionalReport:
    id: uuid.UUID
    user_id: uuid.UUID
    group_id: uuid.UUID
    status_name: str  
    created_at: datetime
    # Opcional: status_id si es necesario