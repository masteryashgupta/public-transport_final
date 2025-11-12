# WebSocket Events Documentation

WebSocket server runs on the same port as the HTTP server.

Connection URL: `ws://localhost:3000`

## Connection Flow

1. Client connects to WebSocket server
2. Client sends `authenticate` event with JWT token
3. Server responds with `authenticated` event
4. Client can now send and receive events

---

## Client → Server Events

### authenticate

Authenticate the WebSocket connection.

**Payload:**
```json
{
  "token": "jwt_token_here"
}
```

**Response:** `authenticated` event

---

### location:update

**Role:** Driver only

Send location update during active trip.

**Payload:**
```json
{
  "tripId": "trip_id",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "speed": 25,
    "heading": 45
  }
}
```

**Broadcasts:** `bus:location` event to all clients

---

### route:subscribe

**Role:** Passenger

Subscribe to updates for a specific route.

**Payload:**
```json
{
  "routeNumber": "5"
}
```

**Response:** `route:subscribed` event

---

### route:unsubscribe

**Role:** Passenger

Unsubscribe from route updates.

**Payload:**
```json
{
  "routeNumber": "5"
}
```

**Response:** `route:unsubscribed` event

---

### trip:started

**Role:** Driver

Notify that a trip has started.

**Payload:**
```json
{
  "tripId": "trip_id",
  "routeNumber": "5"
}
```

**Broadcasts:** `trip:new` event to route subscribers

---

### trip:ended

**Role:** Driver

Notify that a trip has ended.

**Payload:**
```json
{
  "tripId": "trip_id",
  "routeNumber": "5"
}
```

**Broadcasts:** `trip:ended` event to route subscribers

---

## Server → Client Events

### authenticated

Sent after successful authentication.

**Payload:**
```json
{
  "message": "Authentication successful",
  "userId": "user_id",
  "role": "driver"
}
```

---

### bus:location

Broadcasted when a bus location is updated.

**Payload:**
```json
{
  "tripId": "trip_id",
  "busNumber": "BUS-101",
  "routeNumber": "5",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "speed": 25,
    "heading": 45,
    "timestamp": "2025-11-08T10:30:00.000Z"
  }
}
```

---

### route:subscribed

Sent after successfully subscribing to a route.

**Payload:**
```json
{
  "message": "Subscribed to route 5",
  "routeNumber": "5"
}
```

---

### route:unsubscribed

Sent after successfully unsubscribing from a route.

**Payload:**
```json
{
  "message": "Unsubscribed from route 5",
  "routeNumber": "5"
}
```

---

### trip:new

Sent to route subscribers when a new trip starts.

**Payload:**
```json
{
  "message": "New bus started on this route",
  "tripId": "trip_id",
  "routeNumber": "5"
}
```

---

### trip:ended

Sent to route subscribers when a trip ends.

**Payload:**
```json
{
  "message": "Bus trip has ended",
  "tripId": "trip_id",
  "routeNumber": "5"
}
```

---

### heartbeat

Periodic heartbeat to keep connection alive (every 30 seconds).

**Payload:**
```json
{
  "timestamp": 1699444800000
}
```

---

### error

Sent when an error occurs.

**Payload:**
```json
{
  "message": "Error description"
}
```

---

## Example Usage

### JavaScript Client

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

// Authenticate
socket.emit('authenticate', { token: 'jwt_token_here' });

// Listen for authentication
socket.on('authenticated', (data) => {
  console.log('Authenticated:', data);
  
  // Subscribe to route
  socket.emit('route:subscribe', { routeNumber: '5' });
});

// Listen for bus locations
socket.on('bus:location', (data) => {
  console.log('Bus location:', data);
  // Update map marker
});

// Send location update (driver)
socket.emit('location:update', {
  tripId: 'trip_id',
  location: {
    latitude: 40.7128,
    longitude: -74.0060,
    speed: 25,
    heading: 45
  }
});
```

---

## React Native Example

```javascript
import { io } from 'socket.io-client';

const socket = io('http://your-server-ip:3000', {
  transports: ['websocket'],
  autoConnect: false
});

// Connect and authenticate
const connectSocket = (token) => {
  socket.connect();
  socket.emit('authenticate', { token });
};

// Listen for events
socket.on('bus:location', (data) => {
  // Update bus marker on map
  updateBusLocation(data);
});
```
