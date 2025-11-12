import * as Location from 'expo-location';

class LocationService {
  constructor() {
    this.watchId = null;
    this.locationCallback = null;
  }

  async requestPermissions() {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (foregroundStatus !== 'granted') {
        throw new Error('Location permission denied');
      }

      // Request background permission for continuous tracking
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      
      if (backgroundStatus !== 'granted') {
        console.warn('Background location permission denied');
      }

      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  async getCurrentLocation() {
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        speed: position.coords.speed || 0,
        heading: position.coords.heading || 0,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      };
    } catch (error) {
      console.error('Location error:', error);
      throw error;
    }
  }

  async startTracking(callback, interval = 5000) {
    this.locationCallback = callback;
    
    this.watchId = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: interval,
        distanceInterval: 10, // Update every 10 meters
      },
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed ? position.coords.speed * 3.6 : 0, // Convert m/s to km/h
          heading: position.coords.heading || 0,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        
        if (this.locationCallback) {
          this.locationCallback(location);
        }
      }
    );
  }

  stopTracking() {
    if (this.watchId !== null) {
      this.watchId.remove();
      this.watchId = null;
      this.locationCallback = null;
    }
  }
}

export default new LocationService();
