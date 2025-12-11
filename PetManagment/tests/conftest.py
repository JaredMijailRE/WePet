import os

# Set the DATABASE_URL to use an in-memory SQLite database for testing
os.environ["DATABASE_URL"] = "sqlite:///:memory:"

