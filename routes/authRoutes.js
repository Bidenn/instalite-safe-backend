const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route - Step 1: User Registration & Send Email Verification
router.post('/register', authController.register);

// Login route - User Login
router.post('/login', authController.login);

// Logout route - Optional for JWT-based authentication (could just remove token on client-side)
router.post('/logout', authController.logout);

module.exports = router;
