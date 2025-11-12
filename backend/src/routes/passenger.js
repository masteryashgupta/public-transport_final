const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Route = require('../models/Route');
const User = require('../models/User');

// All routes require authentication
router.use(authMiddleware);

// Get all available routes
router.get('/routes', async (req, res) => {
  try {
    const routes = await Route.find({ isActive: true })
      .select('-createdAt -updatedAt');

    res.json({ routes });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ error: 'Server error while fetching routes' });
  }
});

// Get specific route details
router.get('/routes/:routeNumber', async (req, res) => {
  try {
    const route = await Route.findOne({
      routeNumber: req.params.routeNumber,
      isActive: true
    });

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json({ route });
  } catch (error) {
    console.error('Get route error:', error);
    res.status(500).json({ error: 'Server error while fetching route' });
  }
});

// Add route to favorites
router.post('/favorites/add', async (req, res) => {
  try {
    const { routeNumber } = req.body;

    const user = await User.findById(req.userId);
    
    if (!user.favoriteRoutes.includes(routeNumber)) {
      user.favoriteRoutes.push(routeNumber);
      await user.save();
    }

    res.json({
      message: 'Route added to favorites',
      favoriteRoutes: user.favoriteRoutes
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Server error while adding favorite' });
  }
});

// Remove route from favorites
router.post('/favorites/remove', async (req, res) => {
  try {
    const { routeNumber } = req.body;

    const user = await User.findById(req.userId);
    user.favoriteRoutes = user.favoriteRoutes.filter(r => r !== routeNumber);
    await user.save();

    res.json({
      message: 'Route removed from favorites',
      favoriteRoutes: user.favoriteRoutes
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Server error while removing favorite' });
  }
});

// Get favorite routes
router.get('/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const favoriteRoutes = await Route.find({
      routeNumber: { $in: user.favoriteRoutes },
      isActive: true
    });

    res.json({ favoriteRoutes });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Server error while fetching favorites' });
  }
});

module.exports = router;
