import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  Box,
  Button,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

const UserMenu = ({ user, onSignOut }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleMenuOpen}>
        {user ? (
          <Avatar src={user.photoURL} alt={user.displayName} />
        ) : (
          <AccountCircle />
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
            color: darkMode ? "#ffffff" : "#000000",
          },
        }}
      >
        {user ? (
          <Box sx={{ padding: "10px", minWidth: "200px" }}>
            <Typography variant="h6">{user.displayName}</Typography>
            <Typography variant="body2">{user.email}</Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: "10px" }}
              onClick={() => handleNavigate("/user-profile")}
            >
              Ver Perfil
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ marginTop: "10px" }}
              onClick={onSignOut}
            >
              Cerrar Sesión
            </Button>
          </Box>
        ) : (
          <MenuItem onClick={() => handleNavigate("/authentication")}>
            Iniciar Sesión
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default UserMenu;