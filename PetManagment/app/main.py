from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from app.interface.http.routers import router
from app.adapter.db.database import engine
from app.adapter.db import models

models.Base.metadata.create_all(bind=engine)
app = FastAPI(root_path="/pet", docs_url=None, redoc_url="/docs")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081", "*"],  # En producción, especifica los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

Instrumentator().instrument(app).expose(app)
app.include_router(router, tags=["Pets"])