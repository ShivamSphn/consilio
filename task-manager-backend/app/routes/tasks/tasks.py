
from fastapi import APIRouter, Depends, HTTPException
from app.models.models import Task
from app.firebaseconfig import db
from app.middleware.Dependencies import get_current_user
import uuid
from pydantic import BaseModel
import warnings

# Suppress specific warning
warnings.filterwarnings("ignore", message="Detected filter using positional arguments")

router = APIRouter()

class Task(BaseModel):
    text: str



@router.post("/tasks/")
async def create_task(task: Task, current_user: dict = Depends(get_current_user)):
    try:
        task_id = str(uuid.uuid4())
        user_id = current_user['uid']
        db.collection('tasks').document(task_id).set({
            'id': task_id,
            'text': task.text,
            'user_id': user_id
        })
        return {"id": task_id, "text": task.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating task: {str(e)}")


@router.get("/tasks/")
async def get_tasks(current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user['uid']
        tasks_ref = db.collection('tasks').where(
        field_path='user_id', 
        op_string='==', 
        value=user_id)
        tasks = tasks_ref.stream()
        task_list = [{"id": task.id, **task.to_dict()} for task in tasks]
        return task_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching tasks: {str(e)}")

@router.put("/tasks/{task_id}")
async def update_task(task_id: str, task: Task, current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user['uid']
        task_ref = db.collection('tasks').document(task_id)
        task_data = task_ref.get().to_dict()

        if task_data['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to update this task")

        task_ref.update({'text': task.text})
        return {"id": task_id, "text": task.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating task: {str(e)}")

@router.delete("/tasks/{task_id}")
async def delete_task(task_id: str, current_user: dict = Depends(get_current_user)):
    try:
        user_id = current_user['uid']
        task_ref = db.collection('tasks').document(task_id)
        task_data = task_ref.get().to_dict()

        if task_data['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this task")

        task_ref.delete()
        return {"detail": "Task deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting task: {str(e)}")
