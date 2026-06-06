import axios from 'axios';

const HOST = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const API = axios.create({
  baseURL: `${HOST}/articles`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchArticles  = ()              => API.get('/');
export const createArticle  = (article)       => API.post('/', article);
export const updateArticle  = (id, article)   => API.put(`/${id}`, article);
export const deleteArticle  = (id)            => API.delete(`/${id}`);
export const toggleArticle  = (id, isActive)  => API.put(`/${id}`, { isActive });
export const fetchArticleByName = (name) => API.get(`/name/${name}`);
