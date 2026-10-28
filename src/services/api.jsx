import axios from 'axios';


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

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const publicPaths = ['/login', '/register', '/forgot-password'];
      const isPublicPath = publicPaths.some(path => window.location.pathname.startsWith(path));
      const isProfileRequest = error.config?.url?.replace(/^\/api/, '').startsWith('/profile');

      if (!isPublicPath && !isProfileRequest) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;