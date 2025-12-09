from fastapi import FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.interface.http.routers import router
from app.adapter.db.database import engine
from app.adapter.db import models

models.Base.metadata.create_all(bind=engine)
app = FastAPI(
    title="Pet Management API",
    description="API for managing virtual pets. Allows users to feed, clean, name, and check the status of their pets.",
    version="1.0.0",
    root_path="/pet"
)

app.add_middleware(
    TrustedHostMiddleware, allowed_hosts=["*"]
)

app.include_router(router, prefix="/pet", tags=["Pets"])