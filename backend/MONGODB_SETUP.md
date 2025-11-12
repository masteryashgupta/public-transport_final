# MongoDB Setup Guide

You have two options for setting up MongoDB:

## Option 1: MongoDB Atlas (Recommended - Free & Easy)

MongoDB Atlas is a free cloud database service. No local installation required!

### Steps:

1. **Sign up for MongoDB Atlas**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create a free account

2. **Create a Free Cluster**
   - Click "Build a Database"
   - Select "FREE" tier (M0 Sandbox)
   - Choose a cloud provider and region close to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `transportuser`
   - Password: Generate a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist Your IP**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://transportuser:<password>@cluster0.xxxxx.mongodb.net/`)
   - Replace `<password>` with your actual password
   - Add database name: `mongodb+srv://transportuser:yourpassword@cluster0.xxxxx.mongodb.net/public-transport`

6. **Update .env file**
   - Open `backend/.env`
   - Replace the MONGODB_URI with your connection string:
   ```
   MONGODB_URI=mongodb+srv://transportuser:yourpassword@cluster0.xxxxx.mongodb.net/public-transport
   ```

7. **Done!** Your backend will connect to MongoDB Atlas

---

## Option 2: Local MongoDB Installation

### Windows:

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Download MongoDB Community Server for Windows
   - Run the installer

2. **Install MongoDB**
   - Choose "Complete" installation
   - Install as a Windows Service
   - Install MongoDB Compass (GUI tool)

3. **Verify Installation**
   ```bash
   mongod --version
   ```

4. **Start MongoDB Service**
   - MongoDB should start automatically as a Windows service
   - Or manually: `net start MongoDB`

5. **Connection String**
   - Already configured in .env: `mongodb://localhost:27017/public-transport`

### macOS:

```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify
mongod --version
```

### Linux (Ubuntu):

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongod --version
```

---

## Quick Test

After setup, test your connection:

```bash
cd backend
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/public-transport').then(() => { console.log('✅ MongoDB Connected!'); process.exit(0); }).catch(err => { console.error('❌ Connection failed:', err.message); process.exit(1); });"
```

---

## Recommended: Use MongoDB Atlas

For this project, **MongoDB Atlas is recommended** because:
- ✅ No local installation needed
- ✅ Free tier available (512MB storage)
- ✅ Accessible from anywhere
- ✅ Automatic backups
- ✅ Works with mobile apps easily
- ✅ Production-ready

Choose Atlas if you want to test the apps on a physical device or deploy to production later!
