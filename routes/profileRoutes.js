const express = require('express');
const { getProfileData, getProfile, updateProfile, checkUsernameAvailability, getPublicProfile, searchProfile } = require('../controllers/profileController');
const { authenticateJWT } = require('../middlewares/authenticateJWT');
const { upload } = require('../middlewares/uploadUser'); // Assuming you have an upload middleware for profile photo

const router = express.Router();

// Route to get profile data for editing (including authentication data)
router.get('/edit', authenticateJWT, getProfileData);  // Fetch profile data for editing

// Route to get profile details along with posts
router.get('/', authenticateJWT, getProfile);  // Fetch profile data with posts for profile page

// Route to update user profile data
router.put('/update', authenticateJWT, upload.single('profilePhoto'), updateProfile);  // Update profile (with optional photo upload)

// Route to check if a username is available
router.get('/check-username', authenticateJWT , checkUsernameAvailability);  // Check if username is available

// Route to get public profile details along with posts
router.get('/public/:username', authenticateJWT, getPublicProfile);  // Fetch profile data with posts for profile page

router.get('/search/:username', authenticateJWT, searchProfile);

module.exports = router;
