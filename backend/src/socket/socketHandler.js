const jwt = require('jsonwebtoken');
const Trip = require('../models/Trip');

// Store connected clients
const clients = new Map(); // userId -> socket

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Authenticate socket connection
    socket.on('authenticate', async (data) => {
      try {
        const { token } = data;
        
        if (!token) {
          socket.emit('error', { message: 'Authentication token required' });
          return;
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Store user info in socket
        socket.userId = decoded.userId;
        socket.userRole = decoded.role;
        
        // Store socket in clients map
        clients.set(decoded.userId, socket);
        
        socket.emit('authenticated', { 
          message: 'Authentication successful',
          userId: decoded.userId,
          role: decoded.role
        });
        
        console.log(`✅ User authenticated: ${decoded.userId} (${decoded.role})`);
      } catch (error) {
        console.error('Authentication error:', error);
        socket.emit('error', { message: 'Authentication failed' });
      }
    });

    // Driver shares location update
    socket.on('location:update', async (data) => {
      try {
        if (socket.userRole !== 'driver') {
          socket.emit('error', { message: 'Only drivers can share location' });
          return;
        }

        const { tripId, location } = data;

        // Update trip in database
        const trip = await Trip.findOne({
          _id: tripId,
          driverId: socket.userId,
          status: 'active'
        });

        if (!trip) {
          socket.emit('error', { message: 'Active trip not found' });
          return;
        }

        // Update location
        trip.currentLocation = {
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: new Date(),
          speed: location.speed || 0,
          heading: location.heading || 0
        };

        // Add to history
        trip.locationHistory.push(trip.currentLocation);
        if (trip.locationHistory.length > 100) {
          trip.locationHistory = trip.locationHistory.slice(-100);
        }

        await trip.save();

        // Broadcast location to all passengers tracking this route
        io.emit('bus:location', {
          tripId: trip._id,
          busNumber: trip.busNumber,
          routeNumber: trip.routeNumber,
          location: trip.currentLocation
        });

        console.log(`📍 Location updated for trip ${tripId}`);
      } catch (error) {
        console.error('Location update error:', error);
        socket.emit('error', { message: 'Failed to update location' });
      }
    });

    // Passenger subscribes to specific route
    socket.on('route:subscribe', (data) => {
      try {
        const { routeNumber } = data;
        socket.join(`route:${routeNumber}`);
        console.log(`👥 User ${socket.userId} subscribed to route ${routeNumber}`);
        
        socket.emit('route:subscribed', { 
          message: `Subscribed to route ${routeNumber}`,
          routeNumber 
        });
      } catch (error) {
        console.error('Subscribe error:', error);
        socket.emit('error', { message: 'Failed to subscribe to route' });
      }
    });

    // Passenger unsubscribes from route
    socket.on('route:unsubscribe', (data) => {
      try {
        const { routeNumber } = data;
        socket.leave(`route:${routeNumber}`);
        console.log(`👋 User ${socket.userId} unsubscribed from route ${routeNumber}`);
        
        socket.emit('route:unsubscribed', { 
          message: `Unsubscribed from route ${routeNumber}`,
          routeNumber 
        });
      } catch (error) {
        console.error('Unsubscribe error:', error);
        socket.emit('error', { message: 'Failed to unsubscribe from route' });
      }
    });

    // Driver starts trip notification
    socket.on('trip:started', async (data) => {
      try {
        if (socket.userRole !== 'driver') {
          return;
        }

        const { tripId, routeNumber } = data;
        
        // Notify all passengers subscribed to this route
        io.to(`route:${routeNumber}`).emit('trip:new', {
          message: 'New bus started on this route',
          tripId,
          routeNumber
        });

        // Also broadcast globally to all connected clients
        io.emit('trip:new', {
          message: 'New bus started on this route',
          tripId,
          routeNumber
        });

        console.log(`🚌 Trip ${tripId} started on route ${routeNumber}`);
      } catch (error) {
        console.error('Trip started notification error:', error);
      }
    });

    // Driver ends trip notification
    socket.on('trip:ended', async (data) => {
      try {
        if (socket.userRole !== 'driver') {
          return;
        }

        const { tripId, routeNumber } = data;
        
        // Notify all passengers subscribed to this route
        io.to(`route:${routeNumber}`).emit('trip:ended', {
          message: 'Bus trip has ended',
          tripId,
          routeNumber
        });

        // Also broadcast globally to all connected clients
        io.emit('trip:ended', {
          message: 'Bus trip has ended',
          tripId,
          routeNumber
        });

        console.log(`🛑 Trip ${tripId} ended on route ${routeNumber}`);
      } catch (error) {
        console.error('Trip ended notification error:', error);
      }
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      if (socket.userId) {
        clients.delete(socket.userId);
        console.log(`👋 User ${socket.userId} disconnected`);
      }
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  // Periodic heartbeat to keep connections alive
  setInterval(() => {
    io.emit('heartbeat', { timestamp: Date.now() });
  }, 30000); // Every 30 seconds
};
