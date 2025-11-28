from fastapi import FastAPI
from .interface.http.auth import get_auth_router   
from app.adapter.db.database import engine
from app.adapter.db import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


app.include_router(get_auth_router(), prefix="/auth", tags=["Auth"])
