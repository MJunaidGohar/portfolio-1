import axios from 'axios';

// Use environment variable for API URL (set in .env file)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to every request if user is logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTHENTICATION
export const login = (credentials) => {
  return api.post('/auth/login', credentials);
};

export const getCurrentUser = () => {
  return api.get('/auth/me');
};

// USERS - Full CRUD
export const fetchUsers = (limit = 10, page = 1) => {
  return api.get(`/users?limit=${limit}&page=${page}`);
};

export const searchUsers = (query) => {
  return api.get(`/users/search?q=${query}`);
};

export const getUserById = (id) => {
  return api.get(`/users/${id}`);
};

export const createUser = (userData) => {
  return api.post('/users', userData);
};

export const updateUser = (id, userData) => {
  return api.put(`/users/${id}`, userData);
};

export const deleteUser = (id) => {
  return api.delete(`/users/${id}`);
};

// ORDERS - Full management
export const fetchOrders = (status = 'all', page = 1, limit = 20) => {
  return api.get(`/orders?status=${status}&page=${page}&limit=${limit}`);
};

export const getOrderById = (id) => {
  return api.get(`/orders/${id}`);
};

export const updateOrderStatus = (id, status) => {
  return api.patch(`/orders/${id}/status`, { status });
};

// DASHBOARD STATS
export const fetchDashboardStats = () => {
  return api.get('/dashboard/stats');
};

// Keep for backward compatibility with dummyjson
export const fetchCarts = () => {
  return api.get('/carts');
};

export const fetchProducts = (limit = 10) => {
  return api.get(`/products?limit=${limit}`);
};

export default api;
