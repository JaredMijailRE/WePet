import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import uuid

from app.main import app
from app.adapter.db.database import get_db, Base

# Setup in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency override
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

app.dependency_overrides[get_db] = override_get_db

# Reset root_path for testing to avoid 404s if it's set in main.py
app.root_path = ""

client = TestClient(app)

def test_create_pet():
    group_id = str(uuid.uuid4())
    payload = {
        "group_id": group_id,
        "name": "Buddy",
        "type": "dog"
    }
    
    response = client.post("/pet/", json=payload)
    
    if response.status_code == 404:
        print("Routes:")
        for route in app.routes:
            print(f"{route.path} {route.methods}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Buddy"
    assert data["type"] == "dog"
    assert "id" in data

def test_get_group_pet():
    # First create a pet
    group_id = str(uuid.uuid4())
    payload = {
        "group_id": group_id,
        "name": "Mittens",
        "type": "cat"
    }
    create_response = client.post("/pet/", json=payload)
    assert create_response.status_code == 200
    
    # Then get the pet
    response = client.get(f"/pet/{group_id}")
    
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Mittens"
    assert data["type"] == "cat"

