from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime
from app.models.models import Task, TaskCreate, TaskUpdate
from app.firebaseconfig import db
from app.middleware.Dependencies import get_current_user
import uuid
from firebase_admin import firestore

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
    responses={404: {"description": "Not found"}}
)

async def get_task_or_404(task_id: str, user_id: str) -> dict:
    """Helper function to get a task and verify ownership."""
    task_ref = db.collection('tasks').document(task_id)
    task_data = task_ref.get()
    
    if not task_data.exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    task_dict = task_data.to_dict()
    if task_dict['user_id'] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this task"
        )
    
    return task_dict

@router.post("/", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task(task: TaskCreate, current_user: dict = Depends(get_current_user)):
    """
    Create a new task for the authenticated user.
    """
    try:
        task_id = str(uuid.uuid4())
        user_id = current_user['uid']
        
        task_data = {
            'id': task_id,
            'text': task.text,
            'user_id': user_id,
            'created_at': datetime.utcnow(),
            'updated_at': None,
            'completed': False
        }
        
        db.collection('tasks').document(task_id).set(task_data)
        return Task(**task_data)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create task: {str(e)}"
        )

@router.get("/", response_model=List[Task])
async def get_tasks(
    current_user: dict = Depends(get_current_user),
    completed: bool = None
):
    """
    Retrieve all tasks for the authenticated user.
    Optionally filter by completion status.
    """
    try:
        user_id = current_user['uid']
        query = db.collection('tasks').where('user_id', '==', user_id)
        
        if completed is not None:
            query = query.where('completed', '==', completed)
            
        tasks = query.order_by('created_at', direction=firestore.Query.DESCENDING).stream()
        return [Task(**task.to_dict()) for task in tasks]
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch tasks: {str(e)}"
        )

@router.get("/{task_id}", response_model=Task)
async def get_task(task_id: str, current_user: dict = Depends(get_current_user)):
    """
    Retrieve a specific task by ID.
    """
    task_dict = await get_task_or_404(task_id, current_user['uid'])
    return Task(**task_dict)

@router.put("/{task_id}", response_model=Task)
async def update_task(
    task_id: str,
    task_update: TaskUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update a specific task by ID.
    """
    try:
        await get_task_or_404(task_id, current_user['uid'])
        
        update_data = {
            'text': task_update.text,
            'updated_at': datetime.utcnow()
        }
        
        task_ref = db.collection('tasks').document(task_id)
        task_ref.update(update_data)
        
        updated_task = task_ref.get().to_dict()
        return Task(**updated_task)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update task: {str(e)}"
        )

@router.patch("/{task_id}/toggle", response_model=Task)
async def toggle_task_completion(
    task_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Toggle the completion status of a task.
    """
    try:
        task_dict = await get_task_or_404(task_id, current_user['uid'])
        
        task_ref = db.collection('tasks').document(task_id)
        task_ref.update({
            'completed': not task_dict['completed'],
            'updated_at': datetime.utcnow()
        })
        
        updated_task = task_ref.get().to_dict()
        return Task(**updated_task)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to toggle task completion: {str(e)}"
        )

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: str, current_user: dict = Depends(get_current_user)):
    """
    Delete a specific task by ID.
    """
    try:
        await get_task_or_404(task_id, current_user['uid'])
        
        db.collection('tasks').document(task_id).delete()
        return None
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete task: {str(e)}"
        )
