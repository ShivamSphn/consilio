"use client";

import React from "react";
import { useUser } from "../../context/UserContext";

export function Appbar() {
  const { user, logout } = useUser();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        background: "#333",
        color: "#fff",
      }}
    >
      <div>Task Manager</div>
      {user && (
        <button
          onClick={logout}
          style={{
            background: "#f00",
            color: "#fff",
            padding: "5px 10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      )}
    </div>
  );
}
