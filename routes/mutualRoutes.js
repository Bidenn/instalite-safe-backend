const express = require('express');
const { followUser, unfollowUser, viewFollowing, viewFollowers } = require('../controllers/mutualController');
const { authenticateJWT } = require('../middlewares/authenticateJWT');

const router = express.Router();

// Route to follow a user
router.post('/follow', authenticateJWT, followUser); // Follow a user

// Route to unfollow a user
router.delete('/unfollow', authenticateJWT, unfollowUser); // Unfollow a user

// Route to view users the authenticated user is following
router.get('/following', authenticateJWT, viewFollowing); // View all users you are following

// Route to view users following the authenticated user
router.get('/followers', authenticateJWT, viewFollowers); // View all users following you

module.exports = router;
