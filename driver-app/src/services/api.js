import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.31.97:3000/api'; // Change to your server IP for physical devices

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      // Navigate to login (handle in the app)
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// Driver API
export const driverAPI = {
  startTrip: async (tripData) => {
    const response = await api.post('/driver/trip/start', tripData);
    return response.data;
  },
  
  updateLocation: async (tripId, location) => {
    const response = await api.post('/driver/trip/location', { tripId, location });
    return response.data;
  },
  
  endTrip: async (tripId) => {
    const response = await api.post('/driver/trip/end', { tripId });
    return response.data;
  },
  
  getActiveTrip: async () => {
    const response = await api.get('/driver/trip/active');
    return response.data;
  },
  
  getTripHistory: async (page = 1, limit = 10) => {
    const response = await api.get(`/driver/trips/history?page=${page}&limit=${limit}`);
    return response.data;
  },
};

export default api;
