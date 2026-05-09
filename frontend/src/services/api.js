import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('chainmed_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const apiService = {
  // ============ PRODUCTS ============
  
  getProducts: (params) => api.get('/products', { params }),
  
  getProduct: (id) => api.get(`/products/${id}`),
  
  getProductByBatch: (batchNumber) => api.get(`/products/batch/${batchNumber}`),
  
  createProduct: (data) => api.post('/products', data),
  
  updateStatus: (id, data) => api.patch(`/products/${id}/status`, data),
  
  getHistory: (id) => api.get(`/products/${id}/history`),
  
  verifyProduct: (id) => api.get(`/products/${id}/verify`),
  
  recallProduct: (id, reason) => api.post(`/products/${id}/recall`, { reason }),
  
  searchProducts: (params) => api.get('/products/search', { params }),
  
  getStats: () => api.get('/products/stats'),
  
  // ============ ACTORS ============
  
  getActors: () => api.get('/actors'),
  
  // ============ AUTH ============
  
  login: (credentials) => api.post('/auth/login', credentials),
  
  logout: () => {
    localStorage.removeItem('chainmed_token');
  },
};

export default api;
