import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, TIMESTAMP, Uuid
from sqlalchemy import Enum
# from sqlalchemy.dialects.postgresql import UUID
from .database import Base

class PetType(str, enum.Enum):
    CAT = "cat"
    DOG = "dog"
    DRAGON = "dragon"
    DUCK = "duck"



class Pet(Base):
    __tablename__ = "pets"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    group_id = Column(Uuid(as_uuid=True), nullable=False)
    name = Column(String(50), nullable=False)
    type = Column(Enum(PetType), nullable=False)
    hunger_level = Column(Integer, nullable=False, default=100)
    hygiene_level = Column(Integer, nullable=False, default=100)
    health_level = Column(Integer, nullable=False, default=100)
    happiness_level = Column(Integer, nullable=False, default=100)
    level = Column(Integer, nullable=False, default=1)
    xp = Column(Integer, nullable=False, default=0)
    last_updated = Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))