from fastapi import FastAPI
from .interface.http.auth import get_auth_router   

app = FastAPI()


app.include_router(get_auth_router(), prefix="/auth", tags=["Auth"])
