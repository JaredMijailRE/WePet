from fastapi import FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.interface.http.routers import router
from app.adapter.db.database import engine
from app.adapter.db import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(root_path="/groups")

app.add_middleware(
    TrustedHostMiddleware, allowed_hosts=["*"]
)

app.include_router(router, tags=["Groups"])
