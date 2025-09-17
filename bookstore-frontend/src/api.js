import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050/api';

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export default API;
