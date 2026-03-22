import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't loop if we are already logging out or if it's a verification message
      const isLogout = error.config?.url?.includes('/auth/logout');
      const isNotVerified = error.response?.data?.notVerified;

      if (!isLogout && !isNotVerified) {
        console.error(`[DIAGNOSTIC] 401 Error on: ${error.config?.url}`, error.response?.data);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-error'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
