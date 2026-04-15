import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Live Node.js Backend Server
  timeout: 5000,
});

// Interceptor to attach the JWT Authorization token to every request automatically
api.interceptors.request.use((config) => {
  const userString = localStorage.getItem('user');
  if (userString) {
    const user = JSON.parse(userString);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
