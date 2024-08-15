"use client";

import React, { useEffect, useState } from "react";
import TaskItem from "../components/TaskItem/TaskItem";
import { getTasks, createTask, updateTask, deleteTask, Task } from "./helper";
import {
  Typography,
  Container,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";

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
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Tasks
        </Typography>

        <Box
          component="form"
          sx={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            width: "100%",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Enter new task"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateTask}
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Add Task"}
          </Button>
        </Box>

        {tasks.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No tasks available
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {tasks.map((task) => (
              <Grid item xs={12} key={task.id}>
                <Paper elevation={2} sx={{ padding: "10px" }}>
                  <TaskItem
                    id={task.id}
                    text={task.text}
                    onEdit={(id) => handleEdit(id, "New Text")}
                    onDelete={handleDelete}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default TasksPage;
