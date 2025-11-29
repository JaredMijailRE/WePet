from fastapi import FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app = FastAPI(root_path="/pet")

app.add_middleware(
    TrustedHostMiddleware, allowed_hosts=["*"]
)