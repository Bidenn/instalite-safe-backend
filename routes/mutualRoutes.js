const express = require('express');
const { sendFollowRequest, viewPendingRequests, acceptFollowRequest, rejectFollowRequest } = require('../controllers/mutualController');
const { authenticateJWT } = require('../middlewares/authenticateJWT');

const router = express.Router();

// Route for sending a follow request
router.post('/send', authenticateJWT, sendFollowRequest);  // Send follow request to another user

// Route to view all pending follow requests
router.get('/pending', authenticateJWT, viewPendingRequests);  // View all pending follow requests

// Route for accepting a follow request
router.put('/accept', authenticateJWT, acceptFollowRequest);  // Accept a pending follow request

// Route for rejecting a follow request
router.delete('/reject', authenticateJWT, rejectFollowRequest);  // Reject a pending follow request

module.exports = router;
