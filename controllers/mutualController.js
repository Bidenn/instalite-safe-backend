const { Mutual, Auth } = require('../models');

// User A sends follow request to User B
const sendFollowRequest = async (req, res) => {
    try {
        const followerId = req.auth.id; // The user who wants to send the follow request (User A)
        const { followedId } = req.body; // The user to be followed (User B)

        if (!followedId) {
            return res.status(400).json({ error: 'Followed user ID is required' });
        }

        // Ensure the user is not trying to follow themselves
        if (followerId === followedId) {
            return res.status(400).json({ error: 'You cannot send a follow request to yourself' });
        }

        // Check if the user exists
        const followedUser = await Auth.findByPk(followedId);

        if (!followedUser) {
            return res.status(404).json({ error: 'User to send follow request to not found' });
        }

        // Check if the follow request already exists (i.e., the follower has already requested)
        const existingRequest = await Mutual.findOne({
            where: { followerId, followedId, mutualStatus: 'requested' }
        });

        if (existingRequest) {
            return res.status(400).json({ error: 'You have already sent a follow request to this user' });
        }

        // Create a new follow request with 'requested' mutual status
        await Mutual.create({
            followerId,
            followedId,
            mutualStatus: 'requested',
        });

        res.status(201).json({ message: 'Follow request sent successfully' });
    } catch (error) {
        console.error('Error sending follow request:', error);
        res.status(500).json({ error: 'Failed to send follow request' });
    }
};

// View all pending follow requests for User B
const viewPendingRequests = async (req, res) => {
    try {
        const authId = req.auth.id; // The user who wants to see the pending requests (User B)

        // Find all follow requests where the user is the followed user and the status is 'requested'
        const pendingRequests = await Mutual.findAll({
            where: { followedId: authId, mutualStatus: 'requested' },
            include: [{ model: Mutual, as: 'follower', attributes: ['id', 'username', 'email'] }] // Include user who sent the request
        });

        if (!pendingRequests.length) {
            return res.status(200).json({ message: 'No pending requests' });
        }

        res.status(200).json(pendingRequests);
    } catch (error) {
        console.error('Error viewing pending requests:', error);
        res.status(500).json({ error: 'Failed to retrieve pending requests' });
    }
};

// Accept a follow request from User B (User B accepts User A's request)
const acceptFollowRequest = async (req, res) => {
    try {
        const authId = req.auth.id; // User B (who will accept the request)
        const { followerId } = req.body; // User A (who sent the request)

        if (!followerId) {
            return res.status(400).json({ error: 'Follower user ID is required' });
        }

        // Check if the follow request exists and is in the 'requested' status
        const followRequest = await Mutual.findOne({
            where: { followerId, followedId: authId, mutualStatus: 'requested' },
        });

        if (!followRequest) {
            return res.status(404).json({ error: 'Follow request not found' });
        }

        // Update the mutual status of both records to 'accepted'
        await Mutual.update({ mutualStatus: 'accepted' }, { where: { followerId, followedId: authId } });
        await Mutual.update({ mutualStatus: 'accepted' }, { where: { followerId: authId, followedId: followerId } });

        res.status(200).json({ message: 'Follow request accepted' });
    } catch (error) {
        console.error('Error accepting follow request:', error);
        res.status(500).json({ error: 'Failed to accept follow request' });
    }
};

// Reject or ignore a follow request (this will just delete the request or leave it in 'requested' state)
const rejectFollowRequest = async (req, res) => {
    try {
        const authId = req.auth.id; // User B (who will reject the request)
        const { followerId } = req.body; // User A (who sent the request)

        if (!followerId) {
            return res.status(400).json({ error: 'Follower user ID is required' });
        }

        // Find the follow request
        const followRequest = await Mutual.findOne({
            where: { followerId, followedId: authId, mutualStatus: 'requested' },
        });

        if (!followRequest) {
            return res.status(404).json({ error: 'Follow request not found' });
        }

        // Delete the follow request (i.e., reject it)
        await followRequest.destroy();

        res.status(200).json({ message: 'Follow request rejected' });
    } catch (error) {
        console.error('Error rejecting follow request:', error);
        res.status(500).json({ error: 'Failed to reject follow request' });
    }
};

// Exporting controller functions
module.exports = {
    sendFollowRequest,
    viewPendingRequests,
    acceptFollowRequest,
    rejectFollowRequest,
};
