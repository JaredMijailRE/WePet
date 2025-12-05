# Wait for database to be ready (simple approach)
echo "Waiting for database to be ready..."
sleep 10

# Initialize database
echo "Initializing database..."
uv run ./app/adapter/db/init_db.py

# Start the main application
echo "Starting application..."
uv run uvicorn app.main:app --host 0.0.0.0 --port 80 --proxy-headers
