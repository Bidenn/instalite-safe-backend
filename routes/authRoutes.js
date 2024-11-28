const express = require('express');
const router = express.Router();
const { login, register, logout, verifyEmail } = require('../controllers/authController');

// User registration
router.post('/register', register);

// User login
router.post('/login', login);

// User logout
router.post('/logout', logout);

// Email verification
router.get('/verify', verifyEmail);

module.exports = router;
