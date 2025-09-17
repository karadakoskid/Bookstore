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

export default API;
