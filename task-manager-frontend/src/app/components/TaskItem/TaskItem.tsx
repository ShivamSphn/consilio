import React, { useState } from "react";
import {
  Paper,
  Typography,
  IconButton,
  Box,
  TextField,
  Checkbox,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { Task } from "../../tasks/helper";

interface TaskItemProps {
  task: Task;
  onEdit: (id: string, newText: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleComplete: (id: string) => Promise<void>;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditSubmit = async () => {
    if (editText.trim() === "") return;
    if (editText === task.text) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onEdit(task.id, editText);
      setIsEditing(false);
    } catch (error) {
      // Error handling is managed by parent component
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = async () => {
    setIsLoading(true);
    try {
      await onToggleComplete(task.id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        opacity: isLoading ? 0.7 : 1,
        transition: "opacity 0.2s",
      }}
    >
      <Checkbox
        checked={task.completed}
        onChange={handleToggleComplete}
        disabled={isLoading}
      />

      <Box sx={{ flexGrow: 1 }}>
        {isEditing ? (
          <TextField
            fullWidth
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleEditSubmit()}
            disabled={isLoading}
            autoFocus
            size="small"
          />
        ) : (
          <>
            <Typography
              sx={{
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "text.secondary" : "text.primary",
              }}
            >
              {task.text}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Created: {formatDate(task.created_at)}
              {task.updated_at && ` • Updated: ${formatDate(task.updated_at)}`}
            </Typography>
          </>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        {isEditing ? (
          <>
            <Tooltip title="Save">
              <IconButton
                size="small"
                onClick={handleEditSubmit}
                disabled={isLoading}
                color="primary"
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton
                size="small"
                onClick={() => {
                  setIsEditing(false);
                  setEditText(task.text);
                }}
                disabled={isLoading}
              >
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={handleDelete}
            disabled={isLoading}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default TaskItem;
