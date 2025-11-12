# Public Transport Tracking System

A real-time public transport tracking system with separate apps for drivers and passengers.

## System Overview

This system consists of three main components:

1. **Driver App** - Mobile app for bus drivers to share their live location
2. **Passenger App** - Mobile app for passengers to track buses in real-time
3. **Backend Server** - Node.js server handling real-time communication and data storage

## Features

### Driver App
- Login/Authentication for drivers
- Start/Stop trip functionality
- Automatic GPS location sharing when trip is active
- Battery-efficient location tracking
- Trip history

### Passenger App
- Login/Authentication for passengers
- Real-time map showing all active buses
- Filter buses by route
- Estimated arrival times
- Push notifications for delays

### Backend
- RESTful API for data management
- WebSocket support for real-time updates
- MongoDB database for data persistence
- JWT-based authentication
- Scalable architecture

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Driver App | React Native |
| Passenger App | React Native |
| Backend | Node.js + Express |
| Real-time | Socket.IO (WebSocket) |
| Database | MongoDB |
| Maps | Google Maps SDK |
| Authentication | JWT + bcrypt |

## Project Structure

```
public-transport/
├── backend/              # Node.js backend server
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Auth & other middleware
│   │   ├── socket/      # Socket.IO handlers
│   │   └── server.js    # Entry point
│   ├── package.json
│   └── .env.example
│
├── driver-app/          # React Native driver app
│   ├── src/
│   │   ├── screens/     # App screens
│   │   ├── components/  # Reusable components
│   │   ├── services/    # API & Socket services
│   │   ├── navigation/  # Navigation setup
│   │   └── utils/       # Helper functions
│   ├── android/
│   ├── ios/
│   └── package.json
│
├── passenger-app/       # React Native passenger app
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── services/
│   │   ├── navigation/
│   │   └── utils/
│   ├── android/
│   ├── ios/
│   └── package.json
│
└── shared/             # Shared code/constants
    └── constants.js
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- React Native development environment
- Google Maps API key

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd public-transport
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm start
   ```

3. **Set up Driver App**
   ```bash
   cd driver-app
   npm install
   # For Android
   npm run android
   # For iOS
   npm run ios
   ```

4. **Set up Passenger App**
   ```bash
   cd passenger-app
   npm install
   npm run android  # or npm run ios
   ```

## API Documentation

See [backend/API.md](backend/API.md) for detailed API documentation.

## WebSocket Events

See [backend/WEBSOCKET.md](backend/WEBSOCKET.md) for WebSocket event documentation.

## License

MIT

## Contributors

Your Team
