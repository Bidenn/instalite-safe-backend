const express = require('express');
const { authenticateJWT } = require('../middlewares/authenticateJWT');
const { upload } = require('../middlewares/uploadUser'); // Multer config
const { fetchUserDataWithoutPosts, fetchUserDataWithPosts, updateUserData, checkUsernameAvailability } = require('../controllers/userController');

const router = express.Router();

// Fetch user data (without posts)
router.get('/profile/edit', authenticateJWT, fetchUserDataWithoutPosts);

// Fetch user data (with posts)
router.get('/profile', authenticateJWT, fetchUserDataWithPosts);

// Update user data
router.put('/profile/update', authenticateJWT, upload.single('profilePhoto'), updateUserData);

// Check username availability
router.get('/username/check', checkUsernameAvailability);

module.exports = router;
