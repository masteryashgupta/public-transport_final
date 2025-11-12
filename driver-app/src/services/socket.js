import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = 'http://192.168.31.97:3000'; // Change to your server IP

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  async connect() {
    return new Promise(async (resolve, reject) => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        
        if (!token) {
          reject(new Error('No authentication token'));
          return;
        }

        this.socket = io(SOCKET_URL, {
          transports: ['websocket'],
          autoConnect: false,
        });

        this.socket.connect();

        this.socket.on('connect', () => {
          console.log('Socket connected');
          
          // Authenticate
          this.socket.emit('authenticate', { token });
        });

        this.socket.on('authenticated', (data) => {
          console.log('Socket authenticated:', data);
          this.connected = true;
          resolve(data);
        });

        this.socket.on('error', (error) => {
          console.error('Socket error:', error);
          reject(error);
        });

        this.socket.on('disconnect', () => {
          console.log('Socket disconnected');
          this.connected = false;
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          reject(error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  sendLocationUpdate(tripId, location) {
    if (this.socket && this.connected) {
      this.socket.emit('location:update', {
        tripId,
        location,
      });
    }
  }

  notifyTripStarted(tripId, routeNumber) {
    if (this.socket && this.connected) {
      this.socket.emit('trip:started', {
        tripId,
        routeNumber,
      });
    }
  }

  notifyTripEnded(tripId, routeNumber) {
    if (this.socket && this.connected) {
      this.socket.emit('trip:ended', {
        tripId,
        routeNumber,
      });
    }
  }

  onEvent(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  offEvent(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export default new SocketService();
