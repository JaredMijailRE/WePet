from sqlalchemy.orm import Session
from app.domain.repositories.pet_repository import PetRepository
from app.domain.entities.pet import Pet
from app.adapter.db.models import Pet as PetModel
import uuid

class SQLPetRepository(PetRepository):
    def __init__(self, db: Session):
        self.db = db

    def save(self, pet: Pet) -> Pet:
        db_pet = PetModel(
            id=pet.id,
            group_id=pet.group_id,
            name=pet.name,
            type=pet.type,
            level=pet.level,
            xp=pet.xp,
            hunger_level=pet.hunger_level,
            hygiene_level=pet.hygiene_level,
            health_level=pet.health_level,
            happiness_level=pet.happiness_level
        )
        self.db.add(db_pet)
        self.db.commit()
        self.db.refresh(db_pet)
        return pet

    def find_by_group_id(self, group_id: uuid.UUID) -> Pet | None:
        # Aquí mapearíamos de DB a Entidad, pero por brevedad en la creación:
        return self.db.query(PetModel).filter(PetModel.group_id == group_id).first()