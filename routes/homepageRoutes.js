const express = require('express');
const router = express.Router();
const { getHomepageData } = require('../controllers/homepageController');
const { authenticateJWT } = require('../middlewares/authenticateJWT'); // Assuming you're using JWT for authentication

// Homepage route to fetch data for the logged-in user, mutual friends, and posts
router.get('/homepage', authenticateJWT, getHomepageData);

module.exports = router;
