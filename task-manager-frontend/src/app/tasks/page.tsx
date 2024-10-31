"use client";

import React, { useEffect, useState, useCallback } from "react";
import TaskItem from "../components/TaskItem/TaskItem";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompletion,
  Task,
} from "./helper";
import {
  Typography,
  Container,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  Snackbar,
  CircularProgress,
  IconButton,
  FormControlLabel,
  Switch,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskText, setNewTaskText] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await getTasks(showCompleted);
      setTasks(fetchedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [showCompleted]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshKey]);

  const handleEdit = async (id: string, newText: string) => {
    try {
      setError(null);
      const updatedTask = await updateTask(id, newText);
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const handleToggleCompletion = async (id: string) => {
    try {
      setError(null);
      const updatedTask = await toggleTaskCompletion(id);
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle task completion");
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) {
      setError("Task text cannot be empty");
      return;
    }

    setIsCreating(true);
    setError(null);
    try {
      const newTask = await createTask(newTaskText);
      setTasks([newTask, ...tasks]);
      setNewTaskText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" component="h1">
            Tasks
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showCompleted}
                  onChange={(e) => setShowCompleted(e.target.checked)}
                />
              }
              label="Show Completed"
            />
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box
            component="form"
            onSubmit={handleCreateTask}
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="What needs to be done?"
              disabled={isCreating}
              error={!!error && error.includes("empty")}
              helperText={error && error.includes("empty") ? error : ""}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isCreating}
              sx={{ minWidth: 120 }}
            >
              {isCreating ? <CircularProgress size={24} /> : "Add Task"}
            </Button>
          </Box>
        </Paper>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Paper elevation={2} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1" color="textSecondary">
              {showCompleted
                ? "No completed tasks"
                : "No pending tasks. Add one above!"}
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            {tasks.map((task) => (
              <Grid item xs={12} key={task.id}>
                <TaskItem
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleComplete={handleToggleCompletion}
                />
              </Grid>
            ))}
          </Grid>
        )}

        <Snackbar
          open={!!error && !error.includes("empty")}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default TasksPage;
