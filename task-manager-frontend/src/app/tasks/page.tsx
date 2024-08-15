"use client";

import React, { useEffect, useState } from "react";
import TaskItem from "../components/TaskItem/TaskItem";
import { getTasks, createTask, updateTask, deleteTask, Task } from "./helper";

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskText, setNewTaskText] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const tasks = await getTasks();
        setTasks(tasks);
      } catch (error) {
        console.error("Error fetching tasks", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const handleEdit = async (id: string, newText: string) => {
    try {
      const updatedTask = await updateTask(id, newText);
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (error) {
      console.error("Error updating task", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskText.trim()) {
      alert("Task text cannot be empty");
      return;
    }

    setIsCreating(true);
    try {
      const newTask = await createTask(newTaskText);
      setTasks([...tasks, newTask]);
      setNewTaskText(""); // Clear input after successful creation
    } catch (error) {
      console.error("Error creating task", error);
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Tasks</h1>

      {/* Form for creating a new task */}
      <div>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Enter new task"
        />
        <button onClick={handleCreateTask} disabled={isCreating}>
          {isCreating ? "Creating..." : "Add Task"}
        </button>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            id={task.id}
            text={task.text}
            onEdit={(id) => handleEdit(id, "New Text")} // You might want to get this from an input
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
};

export default TasksPage;
