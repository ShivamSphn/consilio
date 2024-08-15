import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface TaskItemProps {
  id: string;
  text: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ id, text, onEdit, onDelete }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <div style={{ flex: 1 }}>{text}</div>
      <button onClick={() => onEdit(id)} style={{ margin: "0 5px" }}>
        <FaEdit />
      </button>
      <button onClick={() => onDelete(id)} style={{ margin: "0 5px" }}>
        <FaTrash />
      </button>
    </div>
  );
};

export default TaskItem;
