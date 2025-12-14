from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
from app.interface.http.routers import router
from app.adapter.db.database import engine
from app.adapter.db import models

models.Base.metadata.create_all(bind=engine)
app = FastAPI(docs_url=None, redoc_url="/docs")

# Health check
@app.get("/")
def health_check():
    return {"status": "ok"}

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])

Instrumentator().instrument(app).expose(app)
app.include_router(router, prefix="/pet", tags=["Pets"])