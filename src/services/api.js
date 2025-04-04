
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication Services
export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Institutions Services
export const institutionService = {
  getAll: async () => {
    const response = await api.get('/institutions');
    return response.data;
  },
  add: async (name) => {
    const response = await api.post('/institutions', { name });
    return response.data;
  },
  update: async (id, name) => {
    const response = await api.put(`/institutions/${id}`, { name });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/institutions/${id}`);
    return response.data;
  },
};

// Receipt Types Services
export const receiptTypeService = {
  getAll: async () => {
    const response = await api.get('/receipt-types');
    return response.data;
  },
  add: async (name) => {
    const response = await api.post('/receipt-types', { name });
    return response.data;
  },
  update: async (id, name) => {
    const response = await api.put(`/receipt-types/${id}`, { name });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/receipt-types/${id}`);
    return response.data;
  },
};

// Transactions Services
export const transactionService = {
  getAll: async () => {
    const response = await api.get('/transactions');
    return response.data;
  },
  add: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },
};

// Users Services
export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  add: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Reports Services
export const reportService = {
  generate: async (startDate, endDate, institutionId, typeId) => {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    
    if (institutionId) params.append('institutionId', institutionId);
    if (typeId) params.append('typeId', typeId);
    
    const response = await api.get(`/reports?${params.toString()}`);
    return response.data;
  },
  updateOpeningBalance: async (openingBalance) => {
    const response = await api.put('/reports/opening-balance', { openingBalance });
    return response.data;
  },
};

// Backup Services
export const backupService = {
  export: async () => {
    const response = await api.get('/backup/export');
    return response.data;
  },
  import: async (backupData) => {
    const response = await api.post('/backup/import', { backupData });
    return response.data;
  },
};

export default api;
