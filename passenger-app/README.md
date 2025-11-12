# Passenger App

React Native app for passengers to track buses in real-time.

## Features

- Passenger authentication
- Real-time map showing all active buses
- Filter buses by route
- Live location updates via WebSocket
- Google Maps integration
- Route subscription

## Prerequisites

- Node.js (v16 or higher)
- React Native development environment
- Google Maps API key
- Android Studio (for Android) or Xcode (for iOS)

## Setup

1. **Install dependencies**
   ```bash
   cd passenger-app
   npm install
   ```

2. **Configure server URL**
   
   Edit `src/services/api.js` and `src/services/socket.js`:
   ```javascript
   const API_URL = 'http://YOUR_SERVER_IP:3000/api';
   const SOCKET_URL = 'http://YOUR_SERVER_IP:3000';
   ```

3. **Add Google Maps API Key**

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

   - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
   {
     [GMSServices provideAPIKey:@"YOUR_GOOGLE_MAPS_API_KEY"];
     // ... rest of code
   }
   ```

4. **Location Permissions (Optional)**
   
   For showing user location on map:
   
   **Android:** `android/app/src/main/AndroidManifest.xml`
   ```xml
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
   ```

   **iOS:** `ios/PassengerApp/Info.plist`
   ```xml
   <key>NSLocationWhenInUseUsageDescription</key>
   <string>Show your location on the map</string>
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
   - Open the app and login with passenger credentials
   - Or register a new passenger account

2. **View All Buses**
   - Map shows all active buses with real-time locations
   - Bus markers update automatically

3. **Filter by Route**
   - Tap on a route button to see only buses on that route
   - Subscribed to real-time updates for that route

4. **Track Bus**
   - Tap on bus marker to see details
   - View bus number, route, and driver info

## Project Structure

```
passenger-app/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js      # Login interface
│   │   └── HomeScreen.js        # Map with buses
│   ├── services/
│   │   ├── api.js              # REST API calls
│   │   └── socket.js           # WebSocket connection
│   └── navigation/
├── android/                     # Android native code
├── ios/                         # iOS native code
└── App.js                       # Entry point
```

## Google Maps Setup

### Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps SDK for Android" and "Maps SDK for iOS"
4. Create credentials (API Key)
5. Restrict API key to your app (optional but recommended)

### Enable Required APIs

- Maps SDK for Android
- Maps SDK for iOS
- Maps JavaScript API (optional)

## Troubleshooting

### Map not showing
- Verify Google Maps API key is correct
- Check API is enabled in Google Cloud Console
- Ensure proper permissions in AndroidManifest.xml/Info.plist

### Buses not updating
- Check WebSocket connection
- Verify server is running
- Check network connectivity

### Cannot connect to server
- Verify server URL in configuration
- Ensure device can reach server IP
- Check firewall settings

### App crashes
- Clear cache: `npm start -- --reset-cache`
- Rebuild app
- Check logs: `npx react-native log-android` or `npx react-native log-ios`
