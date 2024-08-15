import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const getAuthToken = () => localStorage.getItem("token");

const authHeaders = () => {
  const token = getAuthToken();
  console.log("token", token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface Task {
  id: string;
  text: string;
}

// Fetch all tasks
export async function getTasks(): Promise<Task[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/tasks`, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error("Error fetching tasks");
  }
}

// Create a new task
export async function createTask(text: string): Promise<Task> {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/tasks/`,
      { text },
      {
        headers: authHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw new Error("Error creating task");
  }
}

// Update an existing task
export async function updateTask(id: string, text: string): Promise<Task> {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/tasks/${id}`,
      { text },
      {
        headers: authHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw new Error("Error updating task");
  }
}

// Delete a task
export async function deleteTask(id: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/api/tasks/${id}`, {
      headers: authHeaders(),
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    throw new Error("Error deleting task");
  }
}
