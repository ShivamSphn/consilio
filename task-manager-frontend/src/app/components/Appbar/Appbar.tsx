"use client";

import React from "react";
import { useUser } from "../../context/UserContext";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export function Appbar() {
  const { user, logout } = useUser();

  return (
    <AppBar position="static">
      <Toolbar style={{ justifyContent: "space-between" }}>
        <Typography variant="h6" component="div">
          Task Manager
        </Typography>
        {user && (
          <Button
            variant="contained"
            onClick={logout}
            style={{ marginLeft: "auto" }}
          >
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
