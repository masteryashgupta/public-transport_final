# API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register

**POST** `/auth/register`

Register a new user (driver or passenger).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "driver",  // or "passenger"
  "phoneNumber": "+1234567890",
  
  // Driver-specific fields
  "licenseNumber": "DL123456",
  "busNumber": "BUS-101",
  "assignedRoute": "Route 5"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "driver",
    "phoneNumber": "+1234567890",
    "licenseNumber": "DL123456",
    "busNumber": "BUS-101",
    "assignedRoute": "Route 5"
  }
}
```

### Login

**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "driver",
    "phoneNumber": "+1234567890"
  }
}
```

---

## Driver Endpoints

All driver endpoints require authentication and driver role.

### Start Trip

**POST** `/driver/trip/start`

Start a new trip.

**Request Body:**
```json
{
  "busNumber": "BUS-101",
  "routeNumber": "5",
  "routeName": "Downtown Express",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "speed": 0,
    "heading": 0
  }
}
```

**Response:**
```json
{
  "message": "Trip started successfully",
  "trip": {
    "id": "trip_id",
    "busNumber": "BUS-101",
    "routeNumber": "5",
    "routeName": "Downtown Express",
    "status": "active",
    "startTime": "2025-11-08T10:30:00.000Z",
    "currentLocation": {
      "latitude": 40.7128,
      "longitude": -74.0060,
      "speed": 0,
      "heading": 0,
      "timestamp": "2025-11-08T10:30:00.000Z"
    }
  }
}
```

### Update Location

**POST** `/driver/trip/location`

Update location during active trip.

**Request Body:**
```json
{
  "tripId": "trip_id",
  "location": {
    "latitude": 40.7129,
    "longitude": -74.0061,
    "speed": 25,
    "heading": 45
  }
}
```

### End Trip

**POST** `/driver/trip/end`

End an active trip.

**Request Body:**
```json
{
  "tripId": "trip_id"
}
```

### Get Active Trip

**GET** `/driver/trip/active`

Get driver's current active trip.

### Get Trip History

**GET** `/driver/trips/history?page=1&limit=10`

Get driver's completed trips.

---

## Passenger Endpoints

### Get Routes

**GET** `/passenger/routes`

Get all available routes.

### Get Route Details

**GET** `/passenger/routes/:routeNumber`

Get specific route details.

### Add Favorite

**POST** `/passenger/favorites/add`

Add route to favorites.

**Request Body:**
```json
{
  "routeNumber": "5"
}
```

### Remove Favorite

**POST** `/passenger/favorites/remove`

Remove route from favorites.

### Get Favorites

**GET** `/passenger/favorites`

Get user's favorite routes.

---

## Trip Endpoints

### Get Active Trips

**GET** `/trips/active?routeNumber=5`

Get all active trips. Optional filter by route number.

**Response:**
```json
{
  "trips": [
    {
      "id": "trip_id",
      "busNumber": "BUS-101",
      "routeNumber": "5",
      "routeName": "Downtown Express",
      "currentLocation": {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "speed": 25,
        "heading": 45,
        "timestamp": "2025-11-08T10:30:00.000Z"
      },
      "driver": {
        "name": "John Doe",
        "phone": "+1234567890"
      },
      "startTime": "2025-11-08T10:00:00.000Z"
    }
  ]
}
```

### Get Trip Details

**GET** `/trips/:tripId`

Get specific trip details.

---

## Error Responses

All endpoints may return these error responses:

**400 Bad Request:**
```json
{
  "error": "Error message"
}
```

**401 Unauthorized:**
```json
{
  "error": "Authentication failed"
}
```

**403 Forbidden:**
```json
{
  "error": "Access denied"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Server error"
}
```
