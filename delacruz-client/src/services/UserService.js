import axios from 'axios';

const HOST = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const API = axios.create({
  baseURL: `${HOST}/users`,
});

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchUsers = ()           => API.get('/');
export const createUser = (user)       => API.post('/', user);
export const updateUser = (id, user)   => API.put(`/${id}`, user);
export const deleteUser = (id)         => API.delete(`/${id}`);
export const loginUser  = (creds)      => API.post('/login', creds);
