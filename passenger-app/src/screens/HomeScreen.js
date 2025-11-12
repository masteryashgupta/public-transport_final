import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tripAPI, passengerAPI } from '../services/api';
import socketService from '../services/socket';

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const mapRef = useRef(null);

  const [region, setRegion] = useState({
    latitude: 26.9124,  // Jaipur, India
    longitude: 75.7873,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    loadUserData();
    loadRoutes();
    loadActiveTrips();
    setupSocket();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const loadUserData = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  };

  const loadRoutes = async () => {
    try {
      const response = await passengerAPI.getRoutes();
      setRoutes(response.routes);
    } catch (error) {
      console.error('Error loading routes:', error);
    }
  };

  const loadActiveTrips = async (routeNumber = null) => {
    try {
      const response = await tripAPI.getActiveTrips(routeNumber);
      setBuses(response.trips);
      
      // Fit map to show all buses
      if (response.trips.length > 0 && mapRef.current) {
        const coordinates = response.trips.map(trip => ({
          latitude: trip.currentLocation.latitude,
          longitude: trip.currentLocation.longitude,
        }));
        
        if (coordinates.length === 1) {
          mapRef.current.animateToRegion({
            ...coordinates[0],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        } else if (coordinates.length > 1) {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      }
    } catch (error) {
      console.error('Error loading active trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocket = async () => {
    try {
      await socketService.connect();
      
      // Listen for bus location updates
      socketService.onBusLocation((data) => {
        setBuses(prevBuses => {
          const index = prevBuses.findIndex(b => b.id === data.tripId);
          if (index !== -1) {
            const updated = [...prevBuses];
            updated[index] = {
              ...updated[index],
              currentLocation: data.location,
            };
            return updated;
          }
          return prevBuses;
        });
      });

      // Listen for new trips
      socketService.onTripNew((data) => {
        console.log('📍 New trip received:', data);
        if (!selectedRoute || data.routeNumber === selectedRoute) {
          loadActiveTrips(selectedRoute);
        }
      });

      // Listen for ended trips
      socketService.onTripEnded((data) => {
        try {
          console.log('🛑 Trip ended received:', data);

          setBuses(prevBuses => {
            // Defensive comparison: compare stringified IDs to avoid ObjectId vs string mismatches
            const tripIdStr = data && data.tripId ? String(data.tripId) : null;

            // Log ids for debugging
            const prevIds = prevBuses.map(b => String(b.id));
            console.log('🚌 Current bus ids:', prevIds, 'endedTripId:', tripIdStr);

            const filtered = prevBuses.filter(b => String(b.id) !== tripIdStr);
            console.log('🚌 Buses before:', prevBuses.length, 'after:', filtered.length);
            return filtered;
          });
        } catch (err) {
          console.error('Error handling trip:ended event:', err);
        }
      });

    } catch (error) {
      console.error('Socket setup failed:', error);
    }
  };

  const handleRouteSelect = (routeNumber) => {
    if (selectedRoute) {
      socketService.unsubscribeFromRoute(selectedRoute);
    }
    
    if (routeNumber === selectedRoute) {
      // Deselect
      setSelectedRoute(null);
      loadActiveTrips(null);
    } else {
      setSelectedRoute(routeNumber);
      socketService.subscribeToRoute(routeNumber);
      loadActiveTrips(routeNumber);
    }
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Track Buses</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {buses.map((bus) => (
          <React.Fragment key={bus.id}>
            {/* Circular background using Circle component */}
            <Circle
              center={{
                latitude: bus.currentLocation.latitude,
                longitude: bus.currentLocation.longitude,
              }}
              radius={25}
              fillColor="rgba(255, 59, 48, 0.8)"
              strokeColor="rgba(255, 255, 255, 1)"
              strokeWidth={3}
            />
            
            {/* Marker with just the icon and text, no custom View */}
            <Marker
              coordinate={{
                latitude: bus.currentLocation.latitude,
                longitude: bus.currentLocation.longitude,
              }}
              title={`Bus ${bus.busNumber}`}
              description={`Route ${bus.routeNumber}: ${bus.routeName}`}
              onPress={() => {
                // Zoom to bus location when marker is pressed
                mapRef.current?.animateToRegion({
                  latitude: bus.currentLocation.latitude,
                  longitude: bus.currentLocation.longitude,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }, 500);
              }}
            >
              <Text style={{ fontSize: 30 }}>🚌</Text>
            </Marker>
          </React.Fragment>
        ))}
      </MapView>

      <View style={styles.bottomContainer}>
        <View style={styles.routeContainer}>
          <Text style={styles.routeTitle}>Select Route</Text>
          <FlatList
            horizontal
            data={routes}
            keyExtractor={(item) => item.routeNumber}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.routeButton,
                  selectedRoute === item.routeNumber && styles.routeButtonActive,
                ]}
                onPress={() => handleRouteSelect(item.routeNumber)}
              >
                <Text
                  style={[
                    styles.routeButtonText,
                    selectedRoute === item.routeNumber && styles.routeButtonTextActive,
                  ]}
                >
                  {item.routeNumber}
                </Text>
                <Text
                  style={[
                    styles.routeButtonSubtext,
                    selectedRoute === item.routeNumber && styles.routeButtonTextActive,
                  ]}
                >
                  {item.routeName}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {buses.length > 0 && (
          <View style={styles.busListContainer}>
            <Text style={styles.busListTitle}>
              Running Buses ({buses.length})
            </Text>
            <FlatList
              horizontal
              data={buses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.busCard}
                  onPress={() => {
                    mapRef.current?.animateToRegion({
                      latitude: item.currentLocation.latitude,
                      longitude: item.currentLocation.longitude,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }, 500);
                  }}
                >
                  <View style={styles.busCardIcon}>
                    <Text style={styles.busCardEmoji}>🚌</Text>
                  </View>
                  <Text style={styles.busCardNumber}>{item.busNumber}</Text>
                  <Text style={styles.busCardRoute}>{item.routeNumber}</Text>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </View>
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
    padding: 15,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
  markerWrapper: {
    alignItems: 'center',
    width: 100,
    height: 120,
    justifyContent: 'flex-start',
    paddingTop: 10,
    overflow: 'visible',
  },
  busMarker: {
    backgroundColor: '#FF3B30',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.35,
    shadowRadius: 4.65,
    elevation: 8,
    overflow: 'visible',
  },
  busIcon: {
    fontSize: 36,
  },
  busNumberBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    minWidth: 40,
    alignItems: 'center',
  },
  busNumberText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bottomContainer: {
    backgroundColor: '#fff',
  },
  routeContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  routeButton: {
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  routeButtonActive: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  routeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  routeButtonSubtext: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  routeButtonTextActive: {
    color: '#fff',
  },
  busListContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  busListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  busCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  busCardIcon: {
    backgroundColor: '#e74c3c',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: '#fff',
  },
  busCardEmoji: {
    fontSize: 24,
  },
  busCardNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  busCardRoute: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  busCountContainer: {
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  busCountText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});

export default HomeScreen;
