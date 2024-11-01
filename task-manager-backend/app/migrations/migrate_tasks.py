from firebase_admin import firestore
from datetime import datetime
import firebase_admin
from firebase_admin import credentials
import sys
import os
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def initialize_firebase():
    """Initialize Firebase Admin SDK if not already initialized"""
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate("../app/service-account.json")
            firebase_admin.initialize_app(cred)
        return firestore.client()
    except Exception as e:
        logger.error(f"Failed to initialize Firebase: {e}")
        sys.exit(1)

def migrate_tasks():
    """
    Migrate existing tasks to include new fields:
    - completed (boolean)
    - created_at (timestamp)
    - updated_at (timestamp)
    """
    db = initialize_firebase()
    batch = db.batch()
    tasks_ref = db.collection('tasks')
    
    try:
        # Get all tasks
        tasks = tasks_ref.stream()
        
        for task in tasks:
            task_data = task.to_dict()
            
            # Prepare updates only for fields that don't exist
            updates = {}
            
            if 'completed' not in task_data:
                updates['completed'] = False
                
            if 'created_at' not in task_data:
                updates['created_at'] = datetime.utcnow()
                
            if 'updated_at' not in task_data:
                updates['updated_at'] = None
                
            # Only update if there are new fields to add
            if updates:
                logger.info(f"Updating task {task.id} with new fields")
                batch.update(tasks_ref.document(task.id), updates)
        
        # Commit all updates
        batch.commit()
        logger.info("Migration completed successfully")
        
    except Exception as e:
        logger.error(f"Migration failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    logger.info("Starting task migration...")
    migrate_tasks()
    logger.info("Migration completed")
