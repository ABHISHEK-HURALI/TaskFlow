import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshTokenStr = localStorage.getItem('refresh_token');
        if (!refreshTokenStr) throw new Error('No refresh token');
        
        const response = await axios.post(`${api.defaults.baseURL}/auth/refresh/`, {
          refresh: refreshTokenStr
        });
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const registerUser = (userData) => api.post('/auth/register/', userData);
export const loginUser = (credentials) => api.post('/auth/login/', credentials);
export const refreshToken = (refresh) => api.post('/auth/refresh/', { refresh });
export const getTasks = (params) => api.get('/tasks/', { params });
export const getTask = (id) => api.get(`/tasks/${id}/`);
export const createTask = (data) => api.post('/tasks/', data);
export const updateTask = (id, data, isPartial = false) => isPartial ? api.patch(`/tasks/${id}/`, data) : api.put(`/tasks/${id}/`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}/`);

export default api;
