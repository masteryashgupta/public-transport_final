import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.31.97:3000/api'; // Change to your server IP

const api = axios.create({
  baseURL: API_URL,
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

// Passenger API
export const passengerAPI = {
  getRoutes: async () => {
    const response = await api.get('/passenger/routes');
    return response.data;
  },
  
  getRouteDetails: async (routeNumber) => {
    const response = await api.get(`/passenger/routes/${routeNumber}`);
    return response.data;
  },
  
  addFavorite: async (routeNumber) => {
    const response = await api.post('/passenger/favorites/add', { routeNumber });
    return response.data;
  },
  
  removeFavorite: async (routeNumber) => {
    const response = await api.post('/passenger/favorites/remove', { routeNumber });
    return response.data;
  },
  
  getFavorites: async () => {
    const response = await api.get('/passenger/favorites');
    return response.data;
  },
};

// Trip API
export const tripAPI = {
  getActiveTrips: async (routeNumber = null) => {
    const url = routeNumber 
      ? `/trips/active?routeNumber=${routeNumber}`
      : '/trips/active';
    const response = await api.get(url);
    return response.data;
  },
  
  getTripDetails: async (tripId) => {
    const response = await api.get(`/trips/${tripId}`);
    return response.data;
  },
};

export default api;
