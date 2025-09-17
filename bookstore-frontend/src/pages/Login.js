import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    
    try {
      const response = await API.post("/login", { username, password });
      
      // Store token and username in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      localStorage.setItem('username', response.data.username);
      
      setUser(response.data.username);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          fullWidth
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          fullWidth
          required
        />
        {error && (
          <Typography color="error" align="center" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
}

export default Login;
