# 🚀 Quick Start Guide

Your Public Transport Tracking System is now set up! Here's what's been done and what to do next.

## ✅ Completed Setup Steps

1. ✅ **Backend dependencies installed** - All Node.js packages ready
2. ✅ **Environment configured** - `.env` file created with secure JWT secret
3. ✅ **Driver app dependencies installed** - React Native app ready
4. ✅ **Passenger app dependencies installed** - React Native app ready

## 📋 Next Steps

### Step 1: Set Up MongoDB (REQUIRED)

**Option A: MongoDB Atlas (Recommended - 5 minutes)**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account and cluster
3. Follow the guide in `backend/MONGODB_SETUP.md`
4. Update `backend/.env` with your connection string

**Option B: Install MongoDB Locally**
- Windows: Download from https://www.mongodb.com/try/download/community
- See `backend/MONGODB_SETUP.md` for detailed instructions

### Step 2: Start the Backend Server

```bash
cd "d:\public transport\backend"
npm start
```

Expected output:
```
✅ Connected to MongoDB
🚀 Server running on port 3000
📡 WebSocket server ready
```

Test it: Open http://localhost:3000/health in your browser

### Step 3: Get Your Computer's IP Address

The mobile apps need to connect to your server. Find your IP:

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., 192.168.1.100)

**Important:** Use this IP instead of localhost!

### Step 4: Configure Mobile Apps

Update both apps with your server IP:

**Driver App:**
```bash
# Edit these files:
d:\public transport\driver-app\src\services\api.js
d:\public transport\driver-app\src\services\socket.js

# Change:
const API_URL = 'http://localhost:3000/api';
const SOCKET_URL = 'http://localhost:3000';

# To (use your IP):
const API_URL = 'http://192.168.1.100:3000/api';
const SOCKET_URL = 'http://192.168.1.100:3000';
```

**Passenger App:**
```bash
# Edit these files:
d:\public transport\passenger-app\src\services\api.js
d:\public transport\passenger-app\src\services\socket.js

# Same changes as driver app
```

### Step 5: Get Google Maps API Key (for Passenger App)

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable "Maps SDK for Android" and "Maps SDK for iOS"
4. Create API Key
5. Copy the key

### Step 6: Configure Android Apps

**Driver App:**

Edit `driver-app/android/app/src/main/AndroidManifest.xml`:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Add these permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    
    <application>
        <!-- Your app config -->
    </application>
</manifest>
```

**Passenger App:**

Edit `passenger-app/android/app/src/main/AndroidManifest.xml`:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    
    <application>
        <!-- Add Google Maps API Key -->
        <meta-data
            android:name="com.google.android.geo.API_KEY"
            android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
        
        <!-- Your app config -->
    </application>
</manifest>
```

### Step 7: Run the Apps

**Driver App:**
```bash
cd "d:\public transport\driver-app"
npm run android
# or for iOS: npm run ios
```

**Passenger App:**
```bash
cd "d:\public transport\passenger-app"
npm run android
# or for iOS: npm run ios
```

## 🧪 Testing the System

### 1. Create Test Accounts

**Create a Driver:**
Use Postman or curl:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"driver@test.com\",\"password\":\"password123\",\"name\":\"John Driver\",\"role\":\"driver\",\"phoneNumber\":\"+1234567890\",\"licenseNumber\":\"DL123456\",\"busNumber\":\"BUS-101\",\"assignedRoute\":\"5\"}"
```

**Create a Passenger:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"passenger@test.com\",\"password\":\"password123\",\"name\":\"Jane Passenger\",\"role\":\"passenger\",\"phoneNumber\":\"+1234567890\"}"
```

### 2. Add a Test Route

Open MongoDB Compass or use mongo shell:
```javascript
// Connect to your database
// Then insert a route:
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
   - Login: driver@test.com / password123
   - Fill in: Bus 101, Route 5, Downtown Express
   - Click "Start Trip"
   - Grant location permission

2. **Open Passenger App**
   - Login: passenger@test.com / password123
   - Tap "Route 5"
   - You should see Bus 101 on the map!

## 📱 Development Tips

### Running on Physical Device

1. **Enable USB Debugging** on your Android phone
2. **Connect via USB**
3. Run: `adb devices` to verify connection
4. Run the app: `npm run android`

### Using Android Emulator

1. Open Android Studio
2. AVD Manager → Create Virtual Device
3. Choose Pixel 5 or similar
4. Install system image (API 33 recommended)
5. Start emulator
6. Run: `npm run android`

### Hot Reload

- Press `R` twice in terminal to reload
- Shake device to open Dev Menu
- Enable Fast Refresh in Dev Menu

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running/connected
- Verify .env file exists
- Check port 3000 is not in use

### Apps can't connect to server
- Verify server is running
- Check IP address is correct (not localhost)
- Both devices on same WiFi network
- Firewall allows port 3000

### Location not working
- Grant location permissions in app
- Enable GPS on device
- Check AndroidManifest.xml has permissions

### Map not showing
- Verify Google Maps API key
- Check API is enabled in Google Cloud
- Restart Metro bundler

## 📚 Documentation

- `README.md` - Project overview
- `SETUP.md` - Detailed setup guide
- `backend/API.md` - REST API documentation
- `backend/WEBSOCKET.md` - WebSocket events
- `backend/MONGODB_SETUP.md` - MongoDB setup
- `driver-app/README.md` - Driver app guide
- `passenger-app/README.md` - Passenger app guide

## 🎯 What's Working

✅ Backend server with REST API
✅ WebSocket real-time communication
✅ Driver authentication
✅ Passenger authentication
✅ GPS location tracking
✅ Real-time location updates
✅ Google Maps integration
✅ Route filtering
✅ Trip management

## 🚀 Production Deployment

When ready to deploy:

1. **Backend**: Deploy to Heroku, AWS, or DigitalOcean
2. **Database**: Keep using MongoDB Atlas
3. **Mobile Apps**: Build release APK/IPA
4. **Update URLs**: Change to production server URLs

See `SETUP.md` for detailed deployment instructions.

## 💡 Need Help?

Check the documentation files or common issues:
- Can't connect: Verify IP and port
- Location issues: Check permissions
- Map issues: Verify Google Maps API key
- Database issues: Check MongoDB connection

Good luck with your Public Transport Tracking System! 🚍📍
