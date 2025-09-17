import axios from 'axios';

// Use environment variable for API URL, with production fallback
const API_URL = process.env.REACT_APP_API_URL || 
               (window.location.hostname === 'localhost' 
                 ? 'http://localhost:5050/api' 
                 : 'https://bookstore-backend-tlao.onrender.com/api');

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove it
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      // Optionally redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
