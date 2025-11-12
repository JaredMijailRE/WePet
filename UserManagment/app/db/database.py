import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Get the URL from the Docker Compose
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

# Create the session maker, basicaly, opens and closes sessions
# autocommit: Prevents that changes save themselves (?)
# autoflush: Prevents SQLAlchemy from synchronizing the db with the object in each query
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()