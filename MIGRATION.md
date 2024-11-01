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

## 2. Database Schema Migration

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

## 3. Frontend Dependencies Update

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

2. Run database migration
3. Update frontend dependencies
4. Start the services:
   ```bash
   # Backend
   cd task-manager-backend
   uvicorn app.main:app --reload

   # Frontend
   cd task-manager-frontend
   npm run dev
   ```
5. Test new features:
   - Task completion toggle
   - Creation/update timestamps
   - Enhanced error handling
   - Loading states

## Rollback Plan

If issues occur:

1. Environment: 
   - Keep backup of old .env files before updating
   - Restore from backup if needed

2. Database: 
   - Previous data structure remains intact
   - New fields can be safely removed

3. Frontend: 
   - Package.json includes exact versions for safe rollback
   - Use `npm install` with previous package.json if needed
