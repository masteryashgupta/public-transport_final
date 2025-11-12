# 📋 Setup Checklist

Use this checklist to complete your setup step by step.

## ✅ Completed During Setup

- [x] Backend dependencies installed
- [x] Backend .env file created
- [x] Secure JWT secret generated
- [x] Driver app dependencies installed
- [x] Passenger app dependencies installed
- [x] Android manifest files configured
- [x] Project structure created

## 🔲 Required Before Running

### Step 1: Database Setup (Required - 5 minutes)

- [ ] Sign up for MongoDB Atlas: https://www.mongodb.com/cloud/atlas/register
- [ ] Create free cluster (M0 Sandbox)
- [ ] Create database user (username/password)
- [ ] Whitelist IP address (or allow all for development)
- [ ] Copy connection string
- [ ] Update `backend/.env` with connection string:
  ```
  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/public-transport
  ```
- [ ] Test connection by starting backend server

**Alternative:** Install MongoDB locally (see `backend/MONGODB_SETUP.md`)

### Step 2: Get Your Computer's IP (Required - 1 minute)

- [ ] Open Command Prompt/Terminal
- [ ] Run: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- [ ] Note your IPv4 address (e.g., 192.168.1.100)

### Step 3: Update Mobile Apps with Server IP (Required - 2 minutes)

Update these 4 files (replace 192.168.1.100 with YOUR IP):

- [ ] `driver-app/src/services/api.js`
  ```javascript
  const API_URL = 'http://192.168.1.100:3000/api';
  ```
  
- [ ] `driver-app/src/services/socket.js`
  ```javascript
  const SOCKET_URL = 'http://192.168.1.100:3000';
  ```
  
- [ ] `passenger-app/src/services/api.js`
  ```javascript
  const API_URL = 'http://192.168.1.100:3000/api';
  ```
  
- [ ] `passenger-app/src/services/socket.js`
  ```javascript
  const SOCKET_URL = 'http://192.168.1.100:3000';
  ```

### Step 4: Google Maps API Key (Required for Passenger App - 5 minutes)

- [ ] Visit Google Cloud Console: https://console.cloud.google.com/
- [ ] Create new project
- [ ] Enable "Maps SDK for Android"
- [ ] Enable "Maps SDK for iOS" (if testing on iOS)
- [ ] Go to Credentials → Create Credentials → API Key
- [ ] Copy the API key
- [ ] Update `passenger-app/android/app/src/main/AndroidManifest.xml`:
  ```xml
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_ACTUAL_API_KEY_HERE"/>
  ```

## 🚀 Running the System

### Step 5: Start Backend Server

- [ ] Open Terminal 1
- [ ] Run:
  ```bash
  cd "d:\public transport\backend"
  npm start
  ```
- [ ] Verify output shows:
  - "✅ Connected to MongoDB"
  - "🚀 Server running on port 3000"
  - "📡 WebSocket server ready"
- [ ] Test: Open http://localhost:3000/health in browser
- [ ] Should see: `{"status":"OK",...}`

### Step 6: Create Test Route (Optional but Recommended)

Using MongoDB Compass or Atlas web interface:

- [ ] Connect to your database
- [ ] Select `public-transport` database
- [ ] Create `routes` collection (if doesn't exist)
- [ ] Insert document:
  ```json
  {
    "routeNumber": "5",
    "routeName": "Downtown Express",
    "description": "Main route",
    "isActive": true,
    "frequency": 15,
    "operatingHours": {
      "start": "06:00",
      "end": "22:00"
    },
    "stops": [
      {
        "name": "Central Station",
        "latitude": 40.7128,
        "longitude": -74.0060,
        "order": 1
      }
    ]
  }
  ```

### Step 7: Create Test Users

- [ ] Open Postman, browser, or terminal
- [ ] Create driver account:
  ```bash
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"driver@test.com\",\"password\":\"password123\",\"name\":\"Test Driver\",\"role\":\"driver\",\"phoneNumber\":\"+1234567890\",\"licenseNumber\":\"DL001\",\"busNumber\":\"BUS-101\",\"assignedRoute\":\"5\"}"
  ```
- [ ] Create passenger account:
  ```bash
  curl -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"passenger@test.com\",\"password\":\"password123\",\"name\":\"Test Passenger\",\"role\":\"passenger\"}"
  ```
- [ ] Note credentials:
  - Driver: driver@test.com / password123
  - Passenger: passenger@test.com / password123

### Step 8: Run Driver App

- [ ] Open Terminal 2
- [ ] Run:
  ```bash
  cd "d:\public transport\driver-app"
  npm run android
  ```
- [ ] Wait for Metro bundler to start
- [ ] Wait for app to install on device/emulator
- [ ] Login with: driver@test.com / password123
- [ ] Grant location permissions when prompted

### Step 9: Run Passenger App

- [ ] Open Terminal 3
- [ ] Run:
  ```bash
  cd "d:\public transport\passenger-app"
  npm run android
  ```
- [ ] Wait for app to install
- [ ] Login with: passenger@test.com / password123
- [ ] Grant location permissions (optional)

### Step 10: Test the System

- [ ] In Driver App:
  - Enter Bus Number: BUS-101
  - Enter Route Number: 5
  - Enter Route Name: Downtown Express
  - Click "Start Trip"
  - Verify location tracking starts

- [ ] In Passenger App:
  - Tap on "Route 5" button
  - Verify bus marker appears on map
  - Watch bus location update in real-time

## 🎉 Success Criteria

You've successfully set up the system if:

- [x] Backend server is running without errors
- [x] MongoDB connection is successful
- [x] Driver can login and start a trip
- [x] Passenger can see the bus on the map
- [x] Bus location updates in real-time

## 📚 Helpful Resources

- **Setup Issues:** `SETUP.md`
- **MongoDB Help:** `backend/MONGODB_SETUP.md`
- **Quick Start:** `QUICK_START.md`
- **API Docs:** `backend/API.md`
- **WebSocket Events:** `backend/WEBSOCKET.md`

## 🐛 Troubleshooting

If something doesn't work:

1. [ ] Check all checkboxes above are completed
2. [ ] Verify backend server is running
3. [ ] Check MongoDB connection in backend logs
4. [ ] Verify IP addresses are correct (not localhost)
5. [ ] Both devices on same WiFi network
6. [ ] Firewall allows port 3000
7. [ ] Location permissions granted
8. [ ] Google Maps API key is valid

## 📞 Common Commands

**Restart Metro Bundler:**
```bash
npm start -- --reset-cache
```

**Check Device Connection:**
```bash
adb devices
```

**View React Native Logs:**
```bash
npx react-native log-android
```

**Rebuild App:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

---

**Current Status:** Setup dependencies installed ✅  
**Next Step:** Complete the checklist above! 🚀
