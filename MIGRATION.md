# Migration Guide

This guide covers the necessary steps to implement recent changes to the Task Manager application.

## 1. Environment Setup

### Setting up .env file

1. Create a new .env file by copying the sample:
```bash
cp .env.sample .env
```

2. Configure the environment variables in the new .env file:
   - Frontend variables (NEXT_PUBLIC_*)
   - Backend variables
   - Firebase configuration
   - Server settings

3. Firebase Service Account Setup:
   - Place your Firebase service account JSON file at:
     `task-manager-backend/app/service-account.json`
   - Verify the path matches FIREBASE_SERVICE_ACCOUNT_PATH in .env

## 2. Docker Setup

### Prerequisites
- Docker Engine 20.10.0 or later
- Docker Compose v2.0.0 or later

### Running with Docker Compose

1. Build and start the containers:
```bash
docker compose up --build
```

2. Services will be available at:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/api/docs

### Container Configuration

The setup includes:
- Backend container (FastAPI)
  - Python 3.11 base image
  - Non-root user for security
  - Health checks
  - Volume mounts for logs and Firebase credentials

- Frontend container (Next.js)
  - Node 18 base image
  - Multi-stage build for optimization
  - Non-root user for security
  - Health checks
  - Automatic backend service discovery

### Volume Mounts
- Firebase service account: `./task-manager-backend/app/service-account.json:/app/service-account.json:ro`
- Application logs: `./logs:/app/logs`

## 3. Database Schema Migration

New fields added to the tasks collection:
- `completed` (boolean)
- `created_at` (timestamp)
- `updated_at` (timestamp)

To migrate existing data:

```bash
# Navigate to migrations directory
cd task-manager-backend/app/migrations

# Run migration script
python migrate_tasks.py
```

The migration script will:
- Add missing fields to existing tasks
- Set default values (completed = false, created_at = current time)
- Use batch updates to ensure atomic operations

## 4. Frontend Dependencies Update

Updated dependencies include:
- Material-UI components and icons
- Firebase SDK
- TypeScript types
- Testing libraries

To update:

```bash
cd task-manager-frontend

# Install new dependencies
npm install

# Verify installation
npm run type-check
npm run lint
```

## Verification Steps

1. Environment Setup:
   - Verify .env file is in root directory
   - Confirm all required variables are set
   - Check Firebase service account file location

2. Docker Verification:
   - Check container logs: `docker compose logs`
   - Verify health checks: `docker compose ps`
   - Test service connectivity
   - Monitor resource usage: `docker stats`

3. Application Testing:
   - Test task completion toggle
   - Verify timestamps
   - Check error handling
   - Test loading states

## Rollback Plan

1. Docker Rollback:
   ```bash
   # Stop containers
   docker compose down

   # Remove volumes if needed
   docker compose down -v

   # Revert to previous images
   docker compose up --build
   ```

2. Environment: 
   - Keep backup of old .env files before updating
   - Restore from backup if needed

3. Database: 
   - Previous data structure remains intact
   - New fields can be safely removed

4. Frontend: 
   - Package.json includes exact versions for safe rollback
   - Use `npm install` with previous package.json if needed
