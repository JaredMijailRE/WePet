#!/bin/bash
set -e

PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"
DB_PASSWORD="admin" # Insecure for prod, okay for demo
SERVICE_ACCOUNT="wepet-deployer"

echo "Using Project: $PROJECT_ID in $REGION"

# 1. Enable Services
echo "Enabling Cloud Run and Build services..."
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

# 2. Deploy Common Postgres (Ephemeral) (Option B: VM)
echo "Creating a VM for Ephemeral Postgres..."
gcloud compute instances create-with-container wepet-db-vm \
    --container-image postgres:17-alpine \
    --container-env POSTGRES_PASSWORD=$DB_PASSWORD,POSTGRES_USER=admin,POSTGRES_DB=wepetdb \
    --tags http-server,https-server \
    --zone $REGION-a \
    || echo "VM might already exist"

# Open port 5432 firewall
gcloud compute firewall-rules create allow-postgres --allow tcp:5432 --target-tags http-server || true

# Get External IP
DB_IP=$(gcloud compute instances describe wepet-db-vm --zone $REGION-a --format='get(networkInterfaces[0].accessConfigs[0].natIP)')
echo "DB Running at $DB_IP"
DB_URL="postgresql+psycopg2://admin:$DB_PASSWORD@$DB_IP:5432/wepetdb"

# 3. Deploy Backends
echo "Deploying Backend Services..."

# Pet Management
echo "Deploying Pet Management..."
gcloud run deploy pet-service \
  --source ./PetManagment \
  --region $REGION \
  --allow-unauthenticated \
  --port 80 \
  --set-env-vars DATABASE_URL=$DB_URL

PET_URL=$(gcloud run services describe pet-service --region $REGION --format 'value(status.url)')
echo "Pet Service URL: $PET_URL"

# User Management
echo "Deploying User Management..."
gcloud run deploy user-service \
  --source ./UserManagment \
  --region $REGION \
  --allow-unauthenticated \
  --port 80 \
  --set-env-vars DATABASE_URL=$DB_URL

USER_URL=$(gcloud run services describe user-service --region $REGION --format 'value(status.url)')
echo "User Service URL: $USER_URL"

# 4. Deploy Frontend
echo "Deploying Frontend (Building with API URLs)..."
echo "Injecting: PET=$PET_URL, USER=$USER_URL"

# Generate cloudbuild.yaml dynamically
cat > Frontend/cloudbuild.yaml <<EOF
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: [ 'build', '-t', 'gcr.io/$PROJECT_ID/frontend', 
            '--build-arg', 'EXPO_PUBLIC_PET_API_URL=$PET_URL/pet', 
            '--build-arg', 'EXPO_PUBLIC_USER_API_URL=$USER_URL/user',
            '.' ]
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/frontend']
images:
  - 'gcr.io/$PROJECT_ID/frontend'
EOF

gcloud builds submit ./Frontend --config Frontend/cloudbuild.yaml

# Deploy the image
gcloud run deploy frontend \
  --image gcr.io/$PROJECT_ID/frontend \
  --region $REGION \
  --allow-unauthenticated \
  --port 80

FRONTEND_URL=$(gcloud run services describe frontend --region $REGION --format 'value(status.url)')
echo "------------------------------------------------"
echo "Deployment Complete!"
echo "Frontend: $FRONTEND_URL"
echo "Pet Service: $PET_URL"
echo "User Service: $USER_URL"
echo "DB VM IP: $DB_IP"
echo "------------------------------------------------"
