const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  estimatedArrivalTime: {
    type: String  // Format: "HH:MM"
  }
}, { _id: false });

const routeSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: true,
    unique: true
  },
  routeName: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  stops: [stopSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  frequency: {
    type: Number,  // in minutes
    default: 30
  },
  operatingHours: {
    start: String,  // Format: "HH:MM"
    end: String     // Format: "HH:MM"
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

routeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Route', routeSchema);
