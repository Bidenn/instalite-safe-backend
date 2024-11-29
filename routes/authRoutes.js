const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route - Step 1: User Registration & Send Email Verification
router.post('/register', authController.register);

// Verify Email route - Step 2: Email Verification and Create User Profile
router.get('/verify-email', authController.verifyEmail);

// Login route - User Login
router.post('/login', authController.login);

// Logout route - Optional for JWT-based authentication (could just remove token on client-side)
router.post('/logout', authController.logout);

// Request Reset Password - Send Reset Email with Token
router.post('/reset-password', authController.getResetPassword);

// Store Reset Password - After Verifying Token and Changing Password
router.post('/reset-password/confirm', authController.storeResetPassword);

module.exports = router;
