# 🗺️ Google Maps API Key Setup Guide

## Is it Free? ✅ YES!

Google Maps Platform provides:
- **$200 free credit per month**
- **No credit card required** for initial setup (but needed to activate)
- For this project, you'll likely use **less than $1/month** during development
- First 28,000 map loads per month are FREE

---

## Step-by-Step Guide (15 minutes)

### Step 1: Create Google Cloud Account

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   
2. **Sign in with your Google Account**
   - Use any Gmail account
   - If you don't have one, create a free Google account first

3. **Accept Terms of Service**
   - Check the boxes
   - Click "Agree and Continue"

---

### Step 2: Create a New Project

1. **Click on Project Dropdown**
   - Look at the top left (next to "Google Cloud")
   - Click the dropdown that says "Select a project"

2. **Create New Project**
   - Click "NEW PROJECT" button in the top right
   
3. **Enter Project Details**
   - **Project name:** `Public Transport Tracker` (or any name you like)
   - **Organization:** Leave as "No organization"
   - Click "CREATE"

4. **Wait for Project Creation**
   - Takes 10-20 seconds
   - You'll see a notification when ready

5. **Select Your New Project**
   - Click the project dropdown again
   - Select "Public Transport Tracker"

---

### Step 3: Enable Billing (Required but FREE)

⚠️ **Don't worry!** You won't be charged. Google requires billing info but gives you $200 free credit.

1. **Click "Enable Billing"** (if prompted)
   - Or go to: Navigation Menu (☰) → Billing

2. **Create Billing Account**
   - Click "ADD BILLING ACCOUNT"
   - **Country:** Select your country
   - **Currency:** Will auto-select based on country

3. **Enter Payment Information**
   - Add credit/debit card details
   - ✅ You won't be charged during free trial
   - ✅ You'll get email notification before any charges
   - ✅ Can set spending limits to $0 if worried

4. **Start Free Trial**
   - Click "START MY FREE TRIAL"
   - Accept terms
   - Submit

---

### Step 4: Enable Maps SDK for Android

1. **Open Navigation Menu (☰)**
   - Top left corner, three horizontal lines

2. **Go to APIs & Services → Library**
   - Click "APIs & Services"
   - Click "Library"

3. **Search for "Maps SDK for Android"**
   - Type in the search box
   - Click on "Maps SDK for Android"

4. **Enable the API**
   - Click blue "ENABLE" button
   - Wait for activation (10-15 seconds)
   - You'll see a green checkmark when enabled

5. **Repeat for Maps SDK for iOS** (if you plan to test on iOS)
   - Go back to Library
   - Search "Maps SDK for iOS"
   - Click "ENABLE"

---

### Step 5: Create API Key

1. **Go to Credentials**
   - Navigation Menu (☰) → APIs & Services → Credentials
   - Or click "Credentials" in left sidebar

2. **Create Credentials**
   - Click "+ CREATE CREDENTIALS" at the top
   - Select "API key" from dropdown

3. **API Key Created! 🎉**
   - A popup will show your new API key
   - It looks like: `AIzaSyD4-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Click "COPY" to copy it
   - **IMPORTANT:** Save this somewhere safe!

4. **Close the Dialog**
   - Click "CLOSE" (we'll restrict it in next step)

---

### Step 6: Restrict API Key (Recommended for Security)

1. **Click on Your API Key**
   - In the Credentials page
   - Click on the key name (usually "API key 1")

2. **Set Application Restrictions**
   - Scroll to "Application restrictions"
   - Select "Android apps"

3. **Add Your Package Name**
   - Click "+ ADD AN ITEM"
   - **Package name:** `com.driverapp` (for driver app)
   - **SHA-1 certificate fingerprint:** Leave blank for development
   - Click "DONE"

4. **For Passenger App (Repeat)**
   - Click "+ ADD AN ITEM" again
   - **Package name:** `com.passengerapp`
   - Click "DONE"

5. **Set API Restrictions**
   - Scroll to "API restrictions"
   - Select "Restrict key"
   - Check only:
     - ✅ Maps SDK for Android
     - ✅ Maps SDK for iOS (if using iOS)

6. **Save Changes**
   - Click "SAVE" at the bottom
   - Wait for confirmation message

---

### Step 7: Add API Key to Your App

1. **Copy Your API Key**
   - If you closed the popup, go to Credentials page
   - Your API key is listed there
   - Click the copy icon

2. **Open Android Manifest File**
   - File: `passenger-app/android/app/src/main/AndroidManifest.xml`

3. **Find the Google Maps meta-data tag**
   - Look for this line:
   ```xml
   <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="YOUR_GOOGLE_MAPS_API_KEY_HERE"/>
   ```

4. **Replace with Your Actual Key**
   ```xml
   <meta-data
     android:name="com.google.android.geo.API_KEY"
     android:value="AIzaSyD4-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"/>
   ```

5. **Save the File**

---

### Step 8: Verify Setup

1. **Test in Your App**
   - Run the passenger app:
   ```bash
   cd "d:\public transport\passenger-app"
   npm run android
   ```

2. **Map Should Load**
   - If you see the map with Google logo → ✅ Success!
   - If you see gray screen → Check API key
   - If you see "For development purposes only" watermark → API key needs billing enabled

---

## 📊 Free Tier Details

### What's Included FREE:

| Service | Free Monthly Quota | Equivalent Usage |
|---------|-------------------|------------------|
| Maps SDK for Android/iOS | 28,000 loads | ~900 loads/day |
| Static Maps | 28,000 loads | ~900 images/day |
| Geocoding | 40,000 requests | ~1,300/day |

### Your App's Expected Usage:

For this public transport app during development:
- **Passenger app:** ~10-50 map loads per day (when testing)
- **Estimated monthly cost:** $0-$2 (well within free tier)
- **Development:** Completely FREE ✅

### Cost After Free Tier:

Only if you exceed free quota:
- Map loads: $7 per 1,000 (after first 28,000)
- But with $200 free credit, you'd need 28,000+ loads to pay anything

---

## 🔒 Security Best Practices

### 1. Restrict Your API Key

✅ Already done in Step 6!

### 2. Never Commit API Keys to GitHub

Add to `.gitignore`:
```
# API Keys
android/app/src/main/AndroidManifest.xml
google-services.json
```

### 3. Use Environment Variables (Advanced)

For production, store keys in:
- `.env` files (not committed to git)
- CI/CD secrets
- Android/iOS build configs

### 4. Set Usage Quotas

Prevent unexpected charges:
1. Go to: APIs & Services → Dashboard
2. Click "Quotas"
3. Set daily limits (e.g., 100 requests/day for testing)

---

## 🐛 Troubleshooting

### Gray Screen / Map Not Loading

**Problem:** Map shows gray tiles

**Solutions:**
1. ✅ Check API key is correct in AndroidManifest.xml
2. ✅ Enable billing on Google Cloud
3. ✅ Enable "Maps SDK for Android"
4. ✅ Wait 5-10 minutes after enabling API
5. ✅ Rebuild app:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npm run android
   ```

### "For Development Purposes Only" Watermark

**Problem:** Watermark on map

**Solutions:**
1. ✅ Enable billing account
2. ✅ API key restrictions are too strict
3. ✅ Check package name matches

### API Key Error in Logs

**Problem:** "This API project is not authorized to use this API"

**Solutions:**
1. ✅ Enable "Maps SDK for Android" in API Library
2. ✅ Wait 5-10 minutes for activation
3. ✅ Clear app cache and rebuild

### Wrong Package Name

**Problem:** "The API key is not authorized for this app"

**Solutions:**
1. Find your package name in `android/app/build.gradle`:
   ```gradle
   applicationId "com.passengerapp"
   ```
2. Add this EXACT package name to API key restrictions

---

## 📱 Quick Setup Commands

### Check if Maps Works

After adding API key, test your app:

```bash
# Rebuild the app
cd "d:\public transport\passenger-app"
cd android
./gradlew clean
cd ..

# Run app
npm run android

# Check logs
npx react-native log-android | grep -i maps
```

---

## ✅ Verification Checklist

After following this guide:

- [ ] Google Cloud account created
- [ ] Project "Public Transport Tracker" created
- [ ] Billing enabled (free trial activated)
- [ ] Maps SDK for Android enabled
- [ ] API key created and copied
- [ ] API key added to AndroidManifest.xml
- [ ] API key restrictions set (optional but recommended)
- [ ] App rebuilt and tested
- [ ] Map loads successfully in passenger app

---

## 💰 Cost Monitoring

### Set Up Budget Alerts (Optional)

1. Go to: Billing → Budgets & alerts
2. Click "CREATE BUDGET"
3. Set budget: $10 (way more than you'll use)
4. Get email alerts at 50%, 90%, 100%

This way you'll know if something goes wrong!

---

## 🎓 Summary

✅ **Is it free?** YES - $200 credit/month  
✅ **Need credit card?** Yes, but won't be charged  
✅ **Good for this project?** Perfect - way within free limits  
✅ **Time to setup?** 10-15 minutes  
✅ **Difficulty?** Easy - just follow the steps  

---

## 🔗 Useful Links

- Google Cloud Console: https://console.cloud.google.com/
- Maps Platform Pricing: https://developers.google.com/maps/billing-and-pricing/pricing
- Maps SDK Docs: https://developers.google.com/maps/documentation/android-sdk
- Pricing Calculator: https://developers.google.com/maps/billing-and-pricing/pricing

---

## 📞 Need Help?

If you get stuck:
1. Check the Troubleshooting section above
2. Verify all steps in the checklist
3. Wait 5-10 minutes after enabling APIs
4. Try rebuilding the app
5. Check Android logs: `npx react-native log-android`

**Your API key will look like:**  
`AIzaSyD4ao_xxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx`

**Keep it safe and never share it publicly!** 🔒
