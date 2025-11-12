# 🗺️ Mapbox Setup Guide (Google Maps Alternative)

## Why Mapbox? ✅

- ✅ **Easier to get started** - No credit card required for free tier!
- ✅ **50,000 free map loads per month** (vs Google's 28,000)
- ✅ **No billing required** for development
- ✅ **Beautiful maps** with customizable styles
- ✅ **Better free tier** than Google Maps

---

## Step-by-Step Setup (10 minutes)

### Step 1: Create Mapbox Account (2 minutes)

1. **Go to Mapbox Website**
   - Visit: https://account.mapbox.com/auth/signup/

2. **Sign Up for Free**
   - Enter your email
   - Create a password
   - Click "Get started"

3. **Verify Email**
   - Check your inbox
   - Click the verification link
   - Return to Mapbox

4. **Complete Profile** (Optional)
   - You can skip this or fill it out
   - Click "Continue to Mapbox"

### Step 2: Get Your Access Token (1 minute)

1. **You're Now on the Dashboard**
   - You should see your account page

2. **Find Your Default Public Token**
   - Look for "Access tokens" section
   - There's already a "Default public token" created for you!
   - It looks like: `pk.eyJ1IjoieW91cm5hbWUiLCJhIjoiY2x...`

3. **Copy the Token**
   - Click the copy icon next to the token
   - Or select and copy it manually
   - **Save it somewhere safe!**

That's it! No credit card, no billing setup needed! 🎉

---

## Step 3: Update Your Passenger App (5 minutes)

### A. Install Mapbox for React Native

```bash
cd "d:\public transport\passenger-app"
npm install @rnmapbox/maps --legacy-peer-deps
```

### B. Configure Android

1. **Add Mapbox Maven Repository**

Create/edit file: `passenger-app/android/build.gradle`

Find the `allprojects { repositories {` section and add:

```gradle
allprojects {
    repositories {
        // ... existing repos
        maven {
            url 'https://api.mapbox.com/downloads/v2/releases/maven'
            authentication {
                basic(BasicAuthentication)
            }
            credentials {
                username = "mapbox"
                password = project.properties['MAPBOX_DOWNLOADS_TOKEN'] ?: ""
            }
        }
    }
}
```

2. **Add Mapbox Token**

Create file: `passenger-app/android/gradle.properties`

Add this line (replace with your actual token):
```properties
MAPBOX_DOWNLOADS_TOKEN=sk.eyJ1IjoieW91cm5hbWUiLCJhIjoiY2x...
```

**Note:** You might need to create a secret token:
- Go to https://account.mapbox.com/access-tokens/
- Click "Create a token"
- Check "DOWNLOADS:READ" scope
- Click "Create token"
- Use this token in gradle.properties

3. **Update AndroidManifest.xml**

Edit: `passenger-app/android/app/src/main/AndroidManifest.xml`

Remove Google Maps key, add permissions:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    
    <application>
        <!-- Remove the Google Maps meta-data -->
        <!-- Your app config -->
    </application>
</manifest>
```

### C. Update Your Code

I'll help you update the passenger app to use Mapbox instead of Google Maps.

---

## Alternative: OpenStreetMap with react-native-maps

Even easier option - **completely free, no API key needed!**

### Step 1: Keep react-native-maps (Already Installed)

You already have `react-native-maps` installed. We just need to configure it to use OpenStreetMap instead of Google Maps.

### Step 2: Update HomeScreen.js

The map will work without any API key using OpenStreetMap tiles!

---

## Quick Comparison

| Feature | Mapbox | OpenStreetMap | Google Maps |
|---------|--------|---------------|-------------|
| Free Tier | 50,000 loads/month | Unlimited FREE | 28,000 loads/month |
| API Key Required | Yes (free, no card) | No | Yes (needs billing) |
| Setup Difficulty | Easy | Easiest | Medium |
| Map Quality | Excellent | Good | Excellent |
| Customization | High | Medium | Medium |
| Best For | Production apps | Development/Testing | Enterprise apps |

---

## Recommended: Use OpenStreetMap (Easiest!)

Since you're having trouble with Google Maps, let's use **OpenStreetMap** which requires:
- ✅ No API key
- ✅ No sign up
- ✅ Completely free forever
- ✅ Already works with react-native-maps

I'll update your code to use OpenStreetMap right now!

