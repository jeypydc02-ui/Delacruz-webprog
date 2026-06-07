import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Don't transform response — let each caller handle res.data
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);
