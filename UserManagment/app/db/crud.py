from sqlalchemy.orm import Session
from . import models
import uuid

def create_user(db: Session, username: str, email: str, password_hash: str, birth_date):
    new_user = models.User(
        id=uuid.uuid4(),
        username=username,
        email=email,
        password_hash=password_hash,
        birth_date=birth_date
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def get_user(db: Session, user_id: uuid.UUID):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def delete_user(db: Session, user_id: uuid.UUID):
    user = get_user(db, user_id)
    if user:
        db.delete(user)
        db.commit()
    return user
