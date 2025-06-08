import axios from 'axios';
import { getStoredToken, clearStoredToken } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredToken();
      window.location.href = '/login';
    } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      console.error('Backend API is not accessible. Please start the backend server.');
    }
    return Promise.reject(error);
  }
);