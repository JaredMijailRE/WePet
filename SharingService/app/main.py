from fastapi import FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.interface.http.routers import router
from app.adapter.db.database import engine, SessionLocal
from app.adapter.db import models
from fastapi.middleware.cors import CORSMiddleware


models.Base.metadata.create_all(bind=engine)
def seed_emotions():
    db = SessionLocal()
    try:
        
        emotions = [
            "happy", "excited", "calm", "tired",
            "proud", "jealous", "worried", "sad",
            "surprised", "scared", "shy", "angry"
        ]
        for emotion_name in emotions:
            exists = db.query(models.EmotionalStatus).filter_by(name=emotion_name).first()
            if not exists:
                db.add(models.EmotionalStatus(name=emotion_name))
        db.commit()
        print("Emociones inicializadas en DB")
    except Exception as e:
        print(f"Error seeding emotions: {e}")
    finally:
        db.close()
        
seed_emotions()
app = FastAPI(root_path="/sharing")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  # Permitir GET, POST, PUT, DELETE
    allow_headers=["*"],  # Permitir Authorization, Content-Type
)

app.add_middleware(
    TrustedHostMiddleware, allowed_hosts=["*"]
)
app.include_router(router, tags=["Emotional Report"])



