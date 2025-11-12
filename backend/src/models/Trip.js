const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  speed: {
    type: Number,  // in km/h
    default: 0
  },
  heading: {
    type: Number,  // direction in degrees
    default: 0
  }
}, { _id: false });

const tripSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  busNumber: {
    type: String,
    required: true
  },
  routeNumber: {
    type: String,
    required: true
  },
  routeName: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  currentLocation: locationSchema,
  locationHistory: [locationSchema],
  passengers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalDistance: {
    type: Number,  // in kilometers
    default: 0
  },
  averageSpeed: {
    type: Number,  // in km/h
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
tripSchema.index({ driverId: 1, status: 1 });
tripSchema.index({ routeNumber: 1, status: 1 });
tripSchema.index({ status: 1, startTime: -1 });

// Update the updatedAt timestamp
tripSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Trip', tripSchema);
