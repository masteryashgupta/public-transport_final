const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Trip = require('../models/Trip');

// All routes require authentication
router.use(authMiddleware);

// Get all active trips
router.get('/active', async (req, res) => {
  try {
    const { routeNumber } = req.query;
    
    const query = { status: 'active' };
    if (routeNumber) {
      query.routeNumber = routeNumber;
    }

    const trips = await Trip.find(query)
      .populate('driverId', 'name phoneNumber')
      .select('-locationHistory');

    res.json({
      trips: trips.map(trip => ({
        id: trip._id,
        busNumber: trip.busNumber,
        routeNumber: trip.routeNumber,
        routeName: trip.routeName,
        currentLocation: trip.currentLocation,
        driver: {
          name: trip.driverId.name,
          phone: trip.driverId.phoneNumber
        },
        startTime: trip.startTime
      }))
    });
  } catch (error) {
    console.error('Get active trips error:', error);
    res.status(500).json({ error: 'Server error while fetching active trips' });
  }
});

// Get specific trip details
router.get('/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId)
      .populate('driverId', 'name phoneNumber');

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json({
      trip: {
        id: trip._id,
        busNumber: trip.busNumber,
        routeNumber: trip.routeNumber,
        routeName: trip.routeName,
        status: trip.status,
        currentLocation: trip.currentLocation,
        driver: {
          name: trip.driverId.name,
          phone: trip.driverId.phoneNumber
        },
        startTime: trip.startTime,
        endTime: trip.endTime
      }
    });
  } catch (error) {
    console.error('Get trip error:', error);
    res.status(500).json({ error: 'Server error while fetching trip' });
  }
});

module.exports = router;
