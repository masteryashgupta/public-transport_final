import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { driverAPI } from '../services/api';
import socketService from '../services/socket';
import locationService from '../services/location';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tripLoading, setTripLoading] = useState(false);
  
  // Trip form
  const [busNumber, setBusNumber] = useState('');
  const [routeNumber, setRouteNumber] = useState('');
  const [routeName, setRouteName] = useState('');

  useEffect(() => {
    loadUserData();
    checkActiveTrip();
    setupSocket();

    return () => {
      locationService.stopTracking();
      socketService.disconnect();
    };
  }, []);

  const loadUserData = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setBusNumber(parsed.busNumber || '');
      setRouteNumber(parsed.assignedRoute || '');
    }
  };

  const setupSocket = async () => {
    try {
      await socketService.connect();
    } catch (error) {
      console.error('Socket connection failed:', error);
    }
  };

  const checkActiveTrip = async () => {
    try {
      const response = await driverAPI.getActiveTrip();
      if (response.trip) {
        setActiveTrip(response.trip);
        startLocationTracking(response.trip.id);
      }
    } catch (error) {
      console.error('Error checking active trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const startLocationTracking = (tripId) => {
    locationService.startTracking((location) => {
      // Update location via API
      driverAPI.updateLocation(tripId, location).catch(console.error);
      
      // Send via WebSocket for real-time updates
      socketService.sendLocationUpdate(tripId, location);
    }, 5000); // Update every 5 seconds
  };

  const handleStartTrip = async () => {
    if (!busNumber || !routeNumber || !routeName) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const hasPermission = await locationService.requestPermissions();
    if (!hasPermission) {
      Alert.alert('Error', 'Location permission is required');
      return;
    }

    setTripLoading(true);
    try {
      const location = await locationService.getCurrentLocation();
      
      const response = await driverAPI.startTrip({
        busNumber,
        routeNumber,
        routeName,
        location,
      });

      setActiveTrip(response.trip);
      
      // Notify via WebSocket
      socketService.notifyTripStarted(response.trip.id, routeNumber);
      
      // Start location tracking
      startLocationTracking(response.trip.id);
      
      Alert.alert('Success', 'Trip started successfully');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to start trip');
    } finally {
      setTripLoading(false);
    }
  };

  const handleEndTrip = async () => {
    Alert.alert(
      'End Trip',
      'Are you sure you want to end this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Trip',
          style: 'destructive',
          onPress: async () => {
            setTripLoading(true);
            try {
              console.log('Ending trip with ID:', activeTrip.id);
              const response = await driverAPI.endTrip(activeTrip.id);
              console.log('End trip response:', response);
              
              // Notify via WebSocket
              socketService.notifyTripEnded(activeTrip.id, activeTrip.routeNumber);
              
              // Stop location tracking
              locationService.stopTracking();
              
              setActiveTrip(null);
              Alert.alert('Success', 'Trip ended successfully');
            } catch (error) {
              console.error('End trip error:', error);
              console.error('Error response:', error.response?.data);
              console.error('Error message:', error.message);
              Alert.alert('Error', error.response?.data?.error || error.message || 'Failed to end trip');
            } finally {
              setTripLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            if (activeTrip) {
              Alert.alert('Error', 'Please end your trip before logging out');
              return;
            }
            
            locationService.stopTracking();
            socketService.disconnect();
            await AsyncStorage.multiRemove(['authToken', 'user']);
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome, {user?.name}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {activeTrip ? (
        <View style={styles.tripCard}>
          <View style={styles.activeIndicator}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>Trip Active</Text>
          </View>
          
          <View style={styles.tripInfo}>
            <Text style={styles.tripLabel}>Bus Number</Text>
            <Text style={styles.tripValue}>{activeTrip.busNumber}</Text>
          </View>
          
          <View style={styles.tripInfo}>
            <Text style={styles.tripLabel}>Route</Text>
            <Text style={styles.tripValue}>
              {activeTrip.routeNumber} - {activeTrip.routeName}
            </Text>
          </View>
          
          <View style={styles.tripInfo}>
            <Text style={styles.tripLabel}>Started At</Text>
            <Text style={styles.tripValue}>
              {new Date(activeTrip.startTime).toLocaleTimeString()}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.endButton, tripLoading && styles.buttonDisabled]}
            onPress={handleEndTrip}
            disabled={tripLoading}
          >
            {tripLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>End Trip</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Start New Trip</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Bus Number"
            value={busNumber}
            onChangeText={setBusNumber}
            editable={!tripLoading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Route Number"
            value={routeNumber}
            onChangeText={setRouteNumber}
            editable={!tripLoading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Route Name"
            value={routeName}
            onChangeText={setRouteName}
            editable={!tripLoading}
          />

          <TouchableOpacity
            style={[styles.button, styles.startButton, tripLoading && styles.buttonDisabled]}
            onPress={handleStartTrip}
            disabled={tripLoading}
          >
            {tripLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Start Trip</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('TripHistory')}
      >
        <Text style={styles.historyButtonText}>View Trip History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ecf0f1',
    marginTop: 5,
  },
  logoutButton: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
  tripCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2ecc71',
    marginRight: 8,
  },
  activeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  tripInfo: {
    marginBottom: 15,
  },
  tripLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  tripValue: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  startButton: {
    backgroundColor: '#2ecc71',
  },
  endButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyButton: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3498db',
  },
  historyButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
