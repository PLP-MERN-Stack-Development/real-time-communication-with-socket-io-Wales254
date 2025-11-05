// client/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (formData) => {
    return api.put('/auth/updateprofile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updatePassword: (passwordData) => api.put('/auth/updatepassword', passwordData)
};

// Posts API
export const postsAPI = {
  getAllPosts: (params) => api.get('/posts', { params }),
  getPostById: (id) => api.get(`/posts/${id}`),
  createPost: (formData) => {
    return api.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updatePost: (id, formData) => {
    return api.put(`/posts/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deletePost: (id) => api.delete(`/posts/${id}`),
  addComment: (id, commentData) => api.post(`/posts/${id}/comments`, commentData),
  deleteComment: (postId, commentId) => api.delete(`/posts/${postId}/comments/${commentId}`),
  likePost: (id) => api.put(`/posts/${id}/like`)
};

export default api;