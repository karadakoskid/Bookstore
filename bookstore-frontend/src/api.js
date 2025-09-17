import axios from 'axios';

// Always use the local backend for now
const API_URL = 'http://localhost:5050/api';

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export default API;
