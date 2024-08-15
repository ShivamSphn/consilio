import React from "react";
import { Box, IconButton, Typography, Divider } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface TaskItemProps {
  id: string;
  text: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ id, text, onEdit, onDelete }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      padding="10px"
      borderBottom="1px solid #ccc"
    >
      <Typography variant="body1" style={{ flex: 1 }}>
        {text}
      </Typography>
      <IconButton onClick={() => onEdit(id)} color="primary">
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => onDelete(id)} color="secondary">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default TaskItem;
