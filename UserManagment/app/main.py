from fastapi import FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from .interface.http.auth import get_auth_router   
from app.adapter.db.database import engine
from app.adapter.db import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(root_path="/user")

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

app.include_router(get_auth_router(), prefix="/auth", tags=["Auth"])
