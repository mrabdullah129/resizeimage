import axios from 'axios';

export const api = axios.create({
  // Prefer explicit VITE_API_BASE_URL, otherwise target the same host as the page
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sir_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
