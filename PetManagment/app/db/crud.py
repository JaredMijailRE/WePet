from sqlalchemy.orm import Session
from . import models
import uuid
from datetime import datetime, timezone


def create_pet(db: Session, group_id: uuid.UUID, name: str, pet_type: str):
    new_pet = models.Pet(
        id=uuid.uuid4(),
        group_id=group_id,
        name=name,
        type=pet_type,
        hunger_level=100,
        hygiene_level=100,
        health_level=100,
        happiness_level=100,
        last_updated=datetime.now(timezone.utc)
    )
    db.add(new_pet)
    db.commit()
    db.refresh(new_pet)
    return new_pet



def get_pet(db: Session, pet_id: uuid.UUID):
    return db.query(models.Pet).filter(models.Pet.id == pet_id).first()



def get_pets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Pet).offset(skip).limit(limit).all()



def update_pet_status(
    db: Session,
    pet_id: uuid.UUID,
    hunger_level: int = None,
    hygiene_level: int = None,
    health_level: int = None,
    happiness_level: int = None,
):
    pet = get_pet(db, pet_id)
    if not pet:
        return None

    if hunger_level is not None:
        pet.hunger_level = hunger_level
    if hygiene_level is not None:
        pet.hygiene_level = hygiene_level
    if health_level is not None:
        pet.health_level = health_level
    if happiness_level is not None:
        pet.happiness_level = happiness_level

    pet.last_updated = datetime.now(timezone.utc)
    db.commit()
    db.refresh(pet)
    return pet



def delete_pet(db: Session, pet_id: uuid.UUID):
    pet = get_pet(db, pet_id)
    if pet:
        db.delete(pet)
        db.commit()
    return pet