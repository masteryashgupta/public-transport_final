# Driver App

React Native app for bus drivers to share their location in real-time.

## Features

- Driver authentication
- Start/Stop trip functionality
- Automatic GPS location tracking
- Real-time location broadcasting via WebSocket
- Trip history
- Battery-efficient location updates

## Prerequisites

- Node.js (v16 or higher)
- React Native development environment
- Android Studio (for Android) or Xcode (for iOS)

## Setup

1. **Install dependencies**
   ```bash
   cd driver-app
   npm install
   ```

2. **Configure server URL**
   
   Edit `src/services/api.js` and `src/services/socket.js` and update:
   ```javascript
   const API_URL = 'http://YOUR_SERVER_IP:3000/api';
   const SOCKET_URL = 'http://YOUR_SERVER_IP:3000';
   ```

3. **Android Setup**
   
   Add location permissions to `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
   <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
   ```

4. **iOS Setup**
   
   Add location permissions to `ios/DriverApp/Info.plist`:
   ```xml
   <key>NSLocationWhenInUseUsageDescription</key>
   <string>We need your location to track the bus</string>
   <key>NSLocationAlwaysUsageDescription</key>
   <string>We need your location to track the bus</string>
   ```

## Running the App

### Android
```bash
npm run android
```

### iOS
```bash
cd ios
pod install
cd ..
npm run ios
```

## Usage

1. **Login/Register**
   - Open the app and login with driver credentials
   - Or register a new driver account

2. **Start Trip**
   - Enter bus number, route number, and route name
   - Tap "Start Trip"
   - Location tracking begins automatically

3. **During Trip**
   - Location is sent to server every 5 seconds
   - All passengers can see your location in real-time

4. **End Trip**
   - Tap "End Trip" button
   - Location tracking stops automatically

## Project Structure

```
driver-app/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js      # Login interface
│   │   └── HomeScreen.js        # Main dashboard
│   ├── services/
│   │   ├── api.js              # REST API calls
│   │   ├── socket.js           # WebSocket connection
│   │   └── location.js         # GPS tracking
│   └── navigation/
├── android/                     # Android native code
├── ios/                         # iOS native code
└── App.js                       # Entry point
```

## Troubleshooting

### Location not updating
- Check location permissions are granted
- Ensure GPS is enabled on device
- Check server connection

### Cannot connect to server
- Verify server is running
- Check server URL in api.js and socket.js
- Ensure device/emulator can reach server IP

### App crashes on start
- Clear cache: `npm start -- --reset-cache`
- Rebuild app: `npm run android` or `npm run ios`
