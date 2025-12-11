from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from .interface.http.auth import get_auth_router
from .interface.http.accountManager import get_account_manager_router
from app.adapter.db.database import engine
from app.adapter.db import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(root_path="/user")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

app.include_router(get_auth_router(), prefix="/auth", tags=["Auth"])
app.include_router(get_account_manager_router(), tags=["Account"])
