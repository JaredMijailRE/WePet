from .models import EmotionalStatus
from .database import Base, engine, SessionLocal

Base.metadata.create_all(bind=engine)

db = SessionLocal()

default_statuses = [
    "happy",
    "sad",
    "nervous",
    "anxious",
    "calm",
    "exited",
    "fearful",
    "angry",
    "disgusted",
    "surprised",
    "bored",
    "disappointed",
]

for index, status in enumerate(default_statuses, start=1):
    exists = db.query(EmotionalStatus).filter(EmotionalStatus.id == index).first()
    if not exists:
        new_status = EmotionalStatus(id=index, status=status)
        db.add(new_status)

db.commit()
db.close()