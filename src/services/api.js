import axios from 'axios';

/**
 * Axios instance configured with the backend API base URL.
 * All API calls should use this instance for consistent configuration.
 */
const browserLocation = typeof window !== 'undefined' ? window.location : null;
const isLocalhost = browserLocation
  ? browserLocation.hostname === 'localhost' || browserLocation.hostname === '127.0.0.1'
  : false;

const defaultApiBaseUrl = isLocalhost ? 'http://localhost:8081/api' : '/api';

const envApiBaseUrl = process.env.REACT_APP_API_BASE_URL
  ? process.env.REACT_APP_API_BASE_URL.trim().replace(/\/+$/, '')
  : '';

const resolvedApiBaseUrl = envApiBaseUrl || defaultApiBaseUrl;

export const API_BASE_URL = resolvedApiBaseUrl;

const derivedBackendOrigin = API_BASE_URL.endsWith('/api')
  ? API_BASE_URL.slice(0, -4)
  : API_BASE_URL;

export const BACKEND_ORIGIN = process.env.REACT_APP_BACKEND_ORIGIN || derivedBackendOrigin;

export const buildBackendUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${BACKEND_ORIGIN}${path}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
