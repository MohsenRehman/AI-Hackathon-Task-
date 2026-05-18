import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore.js';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': '1.0.0',
  },
});

// ─── Request Interceptor ──────────────────────────────────
instance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    console.log('FRONTEND AXIOS - ATTACHING TOKEN:', token ? `${token.substring(0, 15)}...` : 'NONE');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('FRONTEND AXIOS - REQUEST HEADERS:', config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ── Layer 1: 401 → Clear auth and redirect if not on public auth pages ──
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        window.location.href = '/login';
      }
    }

    // ── Layer 2: Normalize error shape ───────────────────
    const normalizedError = {
      message: error.response?.data?.message || error.message || 'Something went wrong',
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      errors: error.response?.data?.errors || [],
      status: error.response?.status,
    };

    // Toast generic 500s automatically; let components handle 401/403
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(normalizedError);
  }
);

export default instance;
