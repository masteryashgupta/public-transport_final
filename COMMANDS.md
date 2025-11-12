# 🎯 Commands Reference

Quick reference for all commands you'll need.

## 📦 Backend Commands

### Start Server
```bash
cd "d:\public transport\backend"
npm start
```

### Start Server (Development with auto-reload)
```bash
npm run dev
```

### Test MongoDB Connection
```bash
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(err => { console.error('❌ Failed:', err.message); process.exit(1); });"
```

### Check Health Endpoint
```
http://localhost:3000/health
```

---

## 📱 Driver App Commands

### Install Dependencies
```bash
cd "d:\public transport\driver-app"
npm install
```

### Run on Android
```bash
npm run android
```

### Run on iOS (macOS only)
```bash
npm run ios
```

### Start Metro Bundler
```bash
npm start
```

### Clear Cache & Restart
```bash
npm start -- --reset-cache
```

---

## 📱 Passenger App Commands

### Install Dependencies
```bash
cd "d:\public transport\passenger-app"
npm install --legacy-peer-deps
```

### Run on Android
```bash
npm run android
```

### Run on iOS (macOS only)
```bash
npm run ios
```

### Start Metro Bundler
```bash
npm start
```

---

## 🔧 React Native Development

### Check Connected Devices
```bash
adb devices
```

### Reverse Port (for Android emulator)
```bash
adb reverse tcp:3000 tcp:3000
```

### View Logs (Android)
```bash
npx react-native log-android
```

### View Logs (iOS)
```bash
npx react-native log-ios
```

### Reload App
```
Press R twice in Metro bundler terminal
Or shake device and tap "Reload"
```

### Open Developer Menu
```
Shake device
Or: Ctrl+M (Android emulator)
Or: Cmd+D (iOS simulator)
```

### Clean Android Build
```bash
cd android
./gradlew clean
cd ..
npm run android
```

---

## 🗄️ MongoDB Commands

### Using MongoDB Compass (GUI)
1. Download from: https://www.mongodb.com/try/download/compass
2. Connect with your connection string
3. Visual interface for database operations

### Using Mongo Shell (if installed locally)
```bash
# Connect to local MongoDB
mongo

# Connect to MongoDB Atlas
mongo "mongodb+srv://cluster.mongodb.net/public-transport" --username youruser

# Show databases
show dbs

# Use database
use public-transport

# Show collections
show collections

# Find all routes
db.routes.find()

# Find all users
db.users.find()

# Insert a route
db.routes.insertOne({
  routeNumber: "5",
  routeName: "Downtown Express",
  isActive: true,
  stops: []
})
```

---

## 🧪 Testing & API Calls

### Register Driver (using curl)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"driver@test.com\",\"password\":\"password123\",\"name\":\"John Driver\",\"role\":\"driver\",\"phoneNumber\":\"+1234567890\",\"licenseNumber\":\"DL123\",\"busNumber\":\"BUS-101\",\"assignedRoute\":\"5\"}"
```

### Register Passenger (using curl)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"passenger@test.com\",\"password\":\"password123\",\"name\":\"Jane Passenger\",\"role\":\"passenger\"}"
```

### Login (using curl)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"driver@test.com\",\"password\":\"password123\"}"
```

### Get Active Trips
```bash
curl http://localhost:3000/api/trips/active \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🌐 Network Commands

### Get Your IP Address

**Windows:**
```bash
ipconfig
```
Look for: `IPv4 Address`

**macOS/Linux:**
```bash
ifconfig
# or
ip addr show
```

### Check if Port is in Use

**Windows:**
```bash
netstat -ano | findstr :3000
```

**macOS/Linux:**
```bash
lsof -i :3000
```

### Kill Process on Port

**Windows:**
```bash
# Find PID first
netstat -ano | findstr :3000
# Kill process
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
kill -9 $(lsof -ti:3000)
```

---

## 🔑 Environment Variables

### View Current Environment
```bash
cd backend
node -e "require('dotenv').config(); console.log('PORT:', process.env.PORT); console.log('MONGODB_URI:', process.env.MONGODB_URI);"
```

### Generate New JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📦 Package Management

### Update All Dependencies (Backend)
```bash
cd backend
npm update
```

### Update All Dependencies (Apps)
```bash
cd driver-app
npm update

cd ../passenger-app
npm update
```

### Check for Outdated Packages
```bash
npm outdated
```

### Install Specific Package
```bash
npm install package-name
```

### Remove Package
```bash
npm uninstall package-name
```

---

## 🐛 Debugging Commands

### Check Node Version
```bash
node --version
```

### Check npm Version
```bash
npm --version
```

### Check React Native CLI
```bash
npx react-native --version
```

### Check Java (for Android)
```bash
java -version
```

### Verify Android SDK
```bash
echo %ANDROID_HOME%  # Windows
echo $ANDROID_HOME   # Mac/Linux
```

### Clear npm Cache
```bash
npm cache clean --force
```

### Clear Metro Bundler Cache
```bash
npx react-native start --reset-cache
```

### Clear Watchman Cache (if installed)
```bash
watchman watch-del-all
```

### Reset React Native
```bash
rm -rf node_modules
npm install
npx react-native start --reset-cache
```

---

## 🚀 Production Build Commands

### Build Android APK
```bash
cd android
./gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

### Build Android Bundle (for Play Store)
```bash
cd android
./gradlew bundleRelease
```

### Build iOS (Xcode required)
```bash
npx react-native run-ios --configuration Release
```

---

## 💾 Backup & Restore

### Backup MongoDB
```bash
mongodump --uri="mongodb://localhost:27017/public-transport" --out=backup/
```

### Restore MongoDB
```bash
mongorestore --uri="mongodb://localhost:27017/public-transport" backup/public-transport/
```

---

## 🎨 Code Quality

### Lint Code
```bash
npm run lint
```

### Format Code (if prettier installed)
```bash
npx prettier --write .
```

---

## Quick Copy-Paste Commands

### Complete Setup (3 terminals)

**Terminal 1 - Backend:**
```bash
cd "d:\public transport\backend"
npm start
```

**Terminal 2 - Driver App:**
```bash
cd "d:\public transport\driver-app"
npm run android
```

**Terminal 3 - Passenger App:**
```bash
cd "d:\public transport\passenger-app"
npm run android
```

---

Need help? Check the documentation:
- `README.md` - Project overview
- `SETUP.md` - Detailed setup
- `QUICK_START.md` - Quick start guide
- `CHECKLIST.md` - Setup checklist
