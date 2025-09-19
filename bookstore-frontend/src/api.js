import axios from 'axios';

// Use environment variable for API URL, with fallback logic for different environments
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  // Local development (localhost:3000 or localhost:3001)
  if (hostname === 'localhost') {
    return 'http://localhost:5050/api';
  }
  
  // Kubernetes ingress (bookstore.local)
  if (hostname === 'bookstore.local') {
    return 'http://bookstore.local/api';
  }
  
  // Render production (default fallback)
  return 'https://bookstore-backend-tlao.onrender.com/api';
};

const API_URL = getApiUrl();

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
