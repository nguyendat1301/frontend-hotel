import axios from 'axios';
import { AUTH_SESSION_EXPIRED_EVENT } from './authEvents';


const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests (nếu cần fallback)
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

const unauthenticatedEndpoints = new Set([
  '/login',
  '/google-login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/logout',
  '/profile',
]);

const getRequestPath = (url = '') => {
  const pathname = new URL(url, window.location.origin).pathname;
  return pathname.replace(/^\/api(?=\/)/, '').replace(/\/$/, '') || '/';
};

// Handle expired sessions without forcing a full page reload.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !unauthenticatedEndpoints.has(getRequestPath(error.config?.url))
    ) {
      window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  }
);

export default api;