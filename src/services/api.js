import axios from 'axios';

/**
 * Axios instance configured with the backend API base URL.
 * All API calls should use this instance for consistent configuration.
 */
const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
