import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore.js';

export const getApiBaseUrl = () => {
  // If running in browser on Vercel or any non-localhost domain, always use the deployed Vercel backend
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return 'https://ai-hackathon-task-backend.vercel.app/api/v1';
    }
  }

  // If local development, use env var if set, otherwise fallback to local backend
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return envUrl.trim();
  }

  return 'http://localhost:8000/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Version': '1.0.0',
  },
});

// ─── Request Interceptor ──────────────────────────────────
instance.interceptors.request.use(
  (config) => {
    // Runtime safety guard: never allow loopback localhost on production domains
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        config.baseURL = 'https://ai-hackathon-task-backend.vercel.app/api/v1';
        if (config.url && config.url.includes('localhost:8000')) {
          config.url = config.url.replace(/https?:\/\/localhost:8000(\/api\/v1)?/, 'https://ai-hackathon-task-backend.vercel.app/api/v1');
        }
      }
    }

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
