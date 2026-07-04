import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token and session ID on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const sessionId = localStorage.getItem('sf_session_id');
  if (sessionId) {
    config.headers['x-session-id'] = sessionId;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sf_token');
      localStorage.removeItem('sf_user');
    }
    return Promise.reject(error);
  }
);

// ─── Products ─────────────────────────────────────────────────
export const fetchProducts = (params = {}) => api.get('/products', { params });
export const fetchProductById = (id) => api.get(`/products/${id}`);

// ─── Cart ─────────────────────────────────────────────────────
export const fetchCart = () => api.get('/cart');
export const addToCart = (productId, quantity = 1) =>
  api.post('/cart', { productId, quantity });
export const updateCartItem = (itemId, quantity) =>
  api.put(`/cart/${itemId}`, { quantity });
export const removeCartItem = (itemId) => api.delete(`/cart/${itemId}`);
export const clearCart = () => api.delete('/cart/clear');

// ─── Auth ─────────────────────────────────────────────────────
export const loginUser = (email, password) =>
  api.post('/auth/login', { email, password });
export const signupUser = (name, email, password) =>
  api.post('/auth/signup', { name, email, password });
export const getMe = () => api.get('/auth/me');

export default api;
