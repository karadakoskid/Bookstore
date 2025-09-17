import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/" sx={{ textTransform: "none", fontWeight: 700 }}>
            Bookstore
          </Button>
        </Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/books">Books</Button>
        {!user && (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}
        {user && (
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2">Hi, {user}!</Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
