from sqlalchemy.orm import Session
import uuid

from .models import Location, EmotionalReport, EmotionalStatus


# -------------------------
# LOCATIONS CRUD
# -------------------------

def upsert_location(db: Session, user_id: uuid.UUID, latitude: float, longitude: float):
    location = db.query(Location).filter(Location.user_id == user_id).first()

    if location:
        location.latitude = latitude
        location.longitude = longitude
    else:
        location = Location(
            user_id=user_id,
            latitude=latitude,
            longitude=longitude
        )
        db.add(location)

    db.commit()
    db.refresh(location)
    return location


def get_location(db: Session, user_id: uuid.UUID):
    return db.query(Location).filter(Location.user_id == user_id).first()

def delete_location(db: Session, user_id: uuid.UUID):
    location = get_location(db, user_id)
    if location:
        db.delete(location)
        db.commit()
    return location


# -------------------------
# EMOTIONAL REPORTS CRUD
# -------------------------

def create_emotional_report(db: Session, user_id: uuid.UUID, group_id: uuid.UUID, status_id: int):
    emotional_status = db.query(EmotionalStatus).filter(EmotionalStatus.id == status_id).first()
    if not emotional_status:
        return None
    
    report = EmotionalReport(user_id=user_id, group_id=group_id, status_id=status_id)

    db.add(report)
    db.commit()
    db.refresh(report)
    return report

def get_reports_by_user(db: Session, user_id: uuid.UUID, limit=7):
    return (
        db.query(EmotionalReport)
        .filter(EmotionalReport.user_id == user_id)
        .order_by(EmotionalReport.reported_at.desc())
        .limit(limit)
        .all()
    )

def get_reports_by_group(db: Session, group_id: uuid.UUID, limit=20):
    return (
        db.query(EmotionalReport)
        .filter(EmotionalReport.group_id == group_id)
        .order_by(EmotionalReport.reported_at.desc())
        .limit(limit)
        .all()
    )


def delete_report(db: Session, report_id: uuid.UUID):
    report = db.query(EmotionalReport).filter(EmotionalReport.id == report_id).first()
    if report:
        db.delete(report)
        db.commit()
    return report

# -------------------------
# EMOTIONAL STATUS CRUD
# -------------------------

def create_emotional_status(db:Session, id:int, status:str):
    e_status = EmotionalStatus(id=id, status=status)

    db.add(e_status)
    db.commit()
    db.refresh(e_status)

    return e_status

def get_emotional_status_by_status(db:Session, status:str):
    return (
        db.query(EmotionalStatus)
        .filter(EmotionalStatus.status == status)
        .all()
    )

def delete_status(db:Session, status_id:int):
    status = db.query(EmotionalStatus).filter(EmotionalStatus.id == status_id).first()
    if status:
        db.delete(status)
        db.commit()
    return status
