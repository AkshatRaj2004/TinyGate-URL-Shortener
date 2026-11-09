import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT ──────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tg_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: normalise errors ───────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A 401 from login/register just means bad credentials; let the form show it.
    const isAuthAttempt = /\/api\/auth\/(login|register)/.test(error.config?.url || '');
    if (error.response?.status === 401 && !isAuthAttempt) {
      localStorage.removeItem('tg_token');
      localStorage.removeItem('tg_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
