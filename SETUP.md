# Setup Guide

Complete setup guide for the Public Transport Tracking System.

## System Requirements

### Backend Server
- Node.js v16 or higher
- MongoDB (local or cloud)
- npm or yarn

### Mobile Apps
- Node.js v16 or higher
- React Native development environment
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Google Maps API key

## Step-by-Step Setup

### 1. Backend Server Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/public-transport
   JWT_SECRET=your_secure_random_string_here
   JWT_EXPIRE=7d
   CORS_ORIGINS=http://localhost:3000
   ```

4. **Start MongoDB**
   
   Local MongoDB:
   ```bash
   mongod
   ```
   
   Or use MongoDB Atlas (cloud):
   - Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create cluster
   - Get connection string
   - Update MONGODB_URI in .env

5. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Verify server is running**
   
   Open browser and visit: `http://localhost:3000/health`
   
   Should see: `{"status":"OK", ...}`

### 2. Driver App Setup

1. **Navigate to driver-app directory**
   ```bash
   cd driver-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure server URL**
   
   Edit `src/services/api.js`:
   ```javascript
   const API_URL = 'http://YOUR_COMPUTER_IP:3000/api';
   ```
   
   Edit `src/services/socket.js`:
   ```javascript
   const SOCKET_URL = 'http://YOUR_COMPUTER_IP:3000';
   ```
   
   **Finding your IP:**
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr show`
   - For emulator: use `10.0.2.2` (Android) or `localhost` (iOS)

4. **Android Setup**
   
   Edit `android/app/src/main/AndroidManifest.xml`, add inside `<manifest>`:
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
   <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
   ```

5. **Run on Android**
   ```bash
   npm run android
   ```

6. **iOS Setup** (macOS only)
   
   Install pods:
   ```bash
   cd ios
   pod install
   cd ..
   ```
   
   Edit `ios/DriverApp/Info.plist`, add:
   ```xml
   <key>NSLocationWhenInUseUsageDescription</key>
   <string>We need your location to track the bus</string>
   <key>NSLocationAlwaysUsageDescription</key>
   <string>We need your location to track the bus in background</string>
   ```

7. **Run on iOS**
   ```bash
   npm run ios
   ```

### 3. Passenger App Setup

1. **Get Google Maps API Key**
   
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create project
   - Enable "Maps SDK for Android" and "Maps SDK for iOS"
   - Create API Key under Credentials
   - Copy the API key

2. **Navigate to passenger-app directory**
   ```bash
   cd passenger-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure server URL**
   
   Edit `src/services/api.js` and `src/services/socket.js` (same as driver app)

5. **Add Google Maps API Key**
   
   **Android:** Edit `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <application>
     <meta-data
       android:name="com.google.android.geo.API_KEY"
       android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
   </application>
   ```
   
   **iOS:** Edit `ios/PassengerApp/AppDelegate.mm`:
   ```objective-c
   #import <GoogleMaps/GoogleMaps.h>

   - (BOOL)application:(UIApplication *)application 
       didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
   {
     [GMSServices provideAPIKey:@"YOUR_GOOGLE_MAPS_API_KEY"];
     // ... existing code
   }
   ```
   
   Add to `ios/Podfile`:
   ```ruby
   pod 'GoogleMaps'
   ```

6. **Run the app**
   
   Android:
   ```bash
   npm run android
   ```
   
   iOS:
   ```bash
   cd ios && pod install && cd ..
   npm run ios
   ```

## Testing the System

### 1. Create Test Users

Use API testing tool (Postman, curl, or browser):

**Create Driver:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "driver@test.com",
    "password": "password123",
    "name": "John Driver",
    "role": "driver",
    "phoneNumber": "+1234567890",
    "licenseNumber": "DL123456",
    "busNumber": "BUS-101",
    "assignedRoute": "5"
  }'
```

**Create Passenger:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "passenger@test.com",
    "password": "password123",
    "name": "Jane Passenger",
    "role": "passenger",
    "phoneNumber": "+1234567890"
  }'
```

### 2. Create Test Route

Use MongoDB Compass or mongo shell:

```javascript
db.routes.insertOne({
  routeNumber: "5",
  routeName: "Downtown Express",
  description: "Main downtown route",
  isActive: true,
  frequency: 15,
  operatingHours: {
    start: "06:00",
    end: "22:00"
  },
  stops: [
    {
      name: "Central Station",
      latitude: 40.7128,
      longitude: -74.0060,
      order: 1
    },
    {
      name: "City Hall",
      latitude: 40.7127,
      longitude: -74.0059,
      order: 2
    }
  ]
});
```

### 3. Test the Flow

1. **Open Driver App**
   - Login with driver credentials
   - Start a trip with Bus 101, Route 5
   - Verify location tracking starts

2. **Open Passenger App**
   - Login with passenger credentials
   - Select Route 5
   - Verify bus appears on map
   - Watch it update in real-time

## Production Deployment

### Backend Server

**Option 1: Heroku**
```bash
heroku create your-app-name
heroku addons:create mongolab
git push heroku main
```

**Option 2: AWS/DigitalOcean**
- Set up Ubuntu server
- Install Node.js and MongoDB
- Use PM2 for process management
- Configure nginx as reverse proxy
- Set up SSL with Let's Encrypt

### Mobile Apps

**Android:**
```bash
cd android
./gradlew assembleRelease
```
APK located in: `android/app/build/outputs/apk/release/`

**iOS:**
- Open Xcode
- Archive the app
- Upload to App Store Connect

## Troubleshooting

### Backend Issues

**MongoDB connection failed:**
- Check MongoDB is running
- Verify connection string in .env
- Check network access (for MongoDB Atlas)

**Port already in use:**
- Change PORT in .env
- Or kill process: `lsof -ti:3000 | xargs kill`

### Mobile App Issues

**Cannot connect to server:**
- Verify server IP address
- Check firewall allows connection
- Use correct IP (not localhost for physical devices)

**Location not working:**
- Grant location permissions
- Enable GPS on device
- Check permissions in AndroidManifest.xml/Info.plist

**Map not showing:**
- Verify Google Maps API key
- Check API is enabled in Google Cloud
- Verify API key restrictions

**Metro bundler issues:**
```bash
npm start -- --reset-cache
```

## Next Steps

- Add push notifications for arrival alerts
- Implement route optimization
- Add offline support
- Implement admin dashboard
- Add analytics and reporting
- Implement payment integration (if needed)
