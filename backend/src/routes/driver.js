const express = require('express');
const router = express.Router();
const { authMiddleware, isDriver } = require('../middleware/auth');
const Trip = require('../models/Trip');

// All routes require authentication and driver role
router.use(authMiddleware);
router.use(isDriver);

// Start a new trip
router.post('/trip/start', async (req, res) => {
  try {
    const { busNumber, routeNumber, routeName, location } = req.body;

    // Check if driver already has an active trip
    const activeTrip = await Trip.findOne({
      driverId: req.userId,
      status: 'active'
    });

    if (activeTrip) {
      return res.status(400).json({ error: 'You already have an active trip' });
    }

    // Create new trip
    const trip = new Trip({
      driverId: req.userId,
      busNumber,
      routeNumber,
      routeName,
      currentLocation: {
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date(),
        speed: location.speed || 0,
        heading: location.heading || 0
      },
      locationHistory: [{
        latitude: location.latitude,
        longitude: location.longitude,
        timestamp: new Date(),
        speed: location.speed || 0,
        heading: location.heading || 0
      }]
    });

    await trip.save();

    res.status(201).json({
      message: 'Trip started successfully',
      trip: {
        id: trip._id,
        busNumber: trip.busNumber,
        routeNumber: trip.routeNumber,
        routeName: trip.routeName,
        status: trip.status,
        startTime: trip.startTime,
        currentLocation: trip.currentLocation
      }
    });
  } catch (error) {
    console.error('Start trip error:', error);
    res.status(500).json({ error: 'Server error while starting trip' });
  }
});

// Update location during active trip
router.post('/trip/location', async (req, res) => {
  try {
    const { tripId, location } = req.body;

    const trip = await Trip.findOne({
      _id: tripId,
      driverId: req.userId,
      status: 'active'
    });

    if (!trip) {
      return res.status(404).json({ error: 'Active trip not found' });
    }

    // Update current location
    trip.currentLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: new Date(),
      speed: location.speed || 0,
      heading: location.heading || 0
    };

    // Add to location history (keep last 100 locations)
    trip.locationHistory.push(trip.currentLocation);
    if (trip.locationHistory.length > 100) {
      trip.locationHistory = trip.locationHistory.slice(-100);
    }

    // Calculate distance and average speed (simplified)
    if (trip.locationHistory.length > 1) {
      const totalSpeed = trip.locationHistory.reduce((sum, loc) => sum + loc.speed, 0);
      trip.averageSpeed = totalSpeed / trip.locationHistory.length;
    }

    await trip.save();

    res.json({
      message: 'Location updated successfully',
      currentLocation: trip.currentLocation
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ error: 'Server error while updating location' });
  }
});

// End trip
router.post('/trip/end', async (req, res) => {
  try {
    const { tripId } = req.body;

    const trip = await Trip.findOne({
      _id: tripId,
      driverId: req.userId,
      status: 'active'
    });

    if (!trip) {
      return res.status(404).json({ error: 'Active trip not found' });
    }

    trip.status = 'completed';
    trip.endTime = new Date();
    await trip.save();

    res.json({
      message: 'Trip ended successfully',
      trip: {
        id: trip._id,
        busNumber: trip.busNumber,
        routeNumber: trip.routeNumber,
        status: trip.status,
        startTime: trip.startTime,
        endTime: trip.endTime,
        totalDistance: trip.totalDistance,
        averageSpeed: trip.averageSpeed
      }
    });
  } catch (error) {
    console.error('End trip error:', error);
    res.status(500).json({ error: 'Server error while ending trip' });
  }
});

// Get driver's current active trip
router.get('/trip/active', async (req, res) => {
  try {
    const trip = await Trip.findOne({
      driverId: req.userId,
      status: 'active'
    });

    if (!trip) {
      return res.json({ trip: null });
    }

    res.json({
      trip: {
        id: trip._id,
        busNumber: trip.busNumber,
        routeNumber: trip.routeNumber,
        routeName: trip.routeName,
        status: trip.status,
        startTime: trip.startTime,
        currentLocation: trip.currentLocation
      }
    });
  } catch (error) {
    console.error('Get active trip error:', error);
    res.status(500).json({ error: 'Server error while fetching active trip' });
  }
});

// Get driver's trip history
router.get('/trips/history', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const trips = await Trip.find({
      driverId: req.userId,
      status: { $in: ['completed', 'cancelled'] }
    })
    .sort({ startTime: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('-locationHistory');

    const count = await Trip.countDocuments({
      driverId: req.userId,
      status: { $in: ['completed', 'cancelled'] }
    });

    res.json({
      trips,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get trip history error:', error);
    res.status(500).json({ error: 'Server error while fetching trip history' });
  }
});

module.exports = router;
