from fastapi import FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.interface.http.routers import router

app = FastAPI(root_path="/groups")

app.add_middleware(
    TrustedHostMiddleware, allowed_hosts=["*"]
)

app.include_router(router, tags=["Groups"])
