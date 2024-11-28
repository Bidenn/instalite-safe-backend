const express = require('express');
const router = express.Router();
const { homepage } = require('../controllers/homepageController');
const { authenticateJWT } = require('../middlewares/authenticateJWT');

// Use verifyToken middleware to protect the route
router.get('', authenticateJWT, homepage);

module.exports = router;
