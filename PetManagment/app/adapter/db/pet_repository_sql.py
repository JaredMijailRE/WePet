from sqlalchemy.orm import Session
from app.domain.repositories.pet_repository import PetRepository
from app.domain.entities.pet import Pet
from app.adapter.db.models import Pet as PetModel
import uuid

class SQLPetRepository(PetRepository):
    def __init__(self, db: Session):
        self.db = db

    def _to_entity(self, model: PetModel) -> Pet:
        return Pet(
            id=model.id,
            group_id=model.group_id,
            name=model.name,
            type=model.type,
            level=model.level,
            xp=model.xp,
            hunger_level=model.hunger_level,
            hygiene_level=model.hygiene_level,
            health_level=model.health_level,
            happiness_level=model.happiness_level
        )

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
        return self._to_entity(db_pet)

    def update(self, pet: Pet) -> Pet:
        from datetime import datetime, timezone
        model = self.db.query(PetModel).filter(PetModel.id == pet.id).first()
        if model:
            model.name = pet.name
            model.hunger_level = pet.hunger_level
            model.hygiene_level = pet.hygiene_level
            model.level = pet.level
            model.xp = pet.xp
            model.health_level = pet.health_level
            model.happiness_level = pet.happiness_level
            model.last_updated = datetime.now(timezone.utc)
            
            self.db.commit()
            self.db.refresh(model)
            return self._to_entity(model)
        return pet

    def find_by_group_id(self, group_id: uuid.UUID) -> Pet | None:
        model = self.db.query(PetModel).filter(PetModel.group_id == group_id).first()
        if not model:
            return None
        
        # Calculate decay based on last_updated
        from datetime import datetime, timezone
        if model.last_updated:
            now = datetime.now(timezone.utc)
            time_diff = now - model.last_updated
            hours_passed = time_diff.total_seconds() / 3600.0
            
            # Only apply decay if more than 1 minute has passed (to avoid rounding issues)
            if hours_passed > (1.0 / 60.0):  # More than 1 minute
                # Decay rates per hour
                decay_per_hour = {
                    'hunger': 8,
                    'hygiene': 6,
                    'health': 4,
                }
                
                # Apply decay
                model.hunger_level = max(0, min(100, model.hunger_level - (decay_per_hour['hunger'] * hours_passed)))
                model.hygiene_level = max(0, min(100, model.hygiene_level - (decay_per_hour['hygiene'] * hours_passed)))
                model.health_level = max(0, min(100, model.health_level - (decay_per_hour['health'] * hours_passed)))
                
                # Update last_updated to now only if we applied decay
                model.last_updated = now
                self.db.commit()
            # If less than 1 minute, don't apply decay and don't update last_updated
            # This ensures that recent actions (feed/clean/play) are preserved
        
        return self._to_entity(model)

    def find_one(self) -> Pet | None:
        model = self.db.query(PetModel).first()
        return self._to_entity(model) if model else None
