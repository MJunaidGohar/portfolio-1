import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchUsers = (limit = 10) => {
  return api.get(`/users?limit=${limit}`);
};

export const fetchProducts = (limit = 10) => {
  return api.get(`/products?limit=${limit}`);
};

export const fetchCarts = () => {
  return api.get('/carts');
};

export const searchUsers = (query) => {
  return api.get(`/users/search?q=${query}`);
};
