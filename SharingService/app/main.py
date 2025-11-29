from fastapi import FastAPI
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app = FastAPI(root_path="/sharing")

app.add_middleware(
    TrustedHostMiddleware, allowed_hosts=["*"]
)



