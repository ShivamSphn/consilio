import { getAuth } from 'firebase/auth';

export interface Task {
    id: string;
    text: string;
    user_id: string;
    created_at: string;
    updated_at: string | null;
    completed: boolean;
}

interface ApiError {
    detail: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function getAuthToken(): Promise<string> {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        throw new Error('User not authenticated');
    }
    return user.getIdToken();
}

async function handleApiResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.detail || 'An error occurred');
    }
    return response.json();
}

export async function getTasks(completed?: boolean): Promise<Task[]> {
    try {
        const token = await getAuthToken();
        const queryParams = completed !== undefined ? `?completed=${completed}` : '';
        
        const response = await fetch(`${API_BASE_URL}/tasks${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        return handleApiResponse<Task[]>(response);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch tasks');
    }
}

export async function createTask(text: string): Promise<Task> {
    try {
        const token = await getAuthToken();
        
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });
        
        return handleApiResponse<Task>(response);
    } catch (error) {
        console.error('Error creating task:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to create task');
    }
}

export async function updateTask(id: string, text: string): Promise<Task> {
    try {
        const token = await getAuthToken();
        
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text }),
        });
        
        return handleApiResponse<Task>(response);
    } catch (error) {
        console.error('Error updating task:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to update task');
    }
}

export async function toggleTaskCompletion(id: string): Promise<Task> {
    try {
        const token = await getAuthToken();
        
        const response = await fetch(`${API_BASE_URL}/tasks/${id}/toggle`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        return handleApiResponse<Task>(response);
    } catch (error) {
        console.error('Error toggling task completion:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to toggle task completion');
    }
}

export async function deleteTask(id: string): Promise<void> {
    try {
        const token = await getAuthToken();
        
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            const errorData: ApiError = await response.json();
            throw new Error(errorData.detail || 'Failed to delete task');
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to delete task');
    }
}
