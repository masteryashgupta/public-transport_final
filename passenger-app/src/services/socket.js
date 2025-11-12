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

  subscribeToRoute(routeNumber) {
    if (this.socket && this.connected) {
      this.socket.emit('route:subscribe', { routeNumber });
    }
  }

  unsubscribeFromRoute(routeNumber) {
    if (this.socket && this.connected) {
      this.socket.emit('route:unsubscribe', { routeNumber });
    }
  }

  onBusLocation(callback) {
    if (this.socket) {
      this.socket.on('bus:location', callback);
    }
  }

  onTripNew(callback) {
    if (this.socket) {
      this.socket.on('trip:new', callback);
    }
  }

  onTripEnded(callback) {
    if (this.socket) {
      this.socket.on('trip:ended', callback);
    }
  }

  offEvent(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export default new SocketService();
