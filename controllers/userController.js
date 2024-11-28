const Post = require('../models/Post');
const User = require('../models/User');

// Fetch user data without posts
const fetchUserDataWithoutPosts = async (req, res) => {
    try {
        const userId = req.user.id; 

        const user = await User.findOne({
            where: { id: userId },
            attributes: ['id', 'username', 'fullName', 'profilePhoto', 'aboutMe', 'career'],
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};

// Fetch user data with posts
const fetchUserDataWithPosts = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from middleware

        const user = await User.findOne({
            where: { id: userId },
            attributes: ['id', 'username', 'fullName', 'profilePhoto', 'aboutMe', 'career'],
            include: {
                model: Post,
                as: 'posts', // Ensure this matches your association name
                attributes: ['id', 'caption', 'content', 'createdAt'],
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(user);

        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile with posts:', error);
        res.status(500).json({ error: 'Failed to fetch user profile with posts' });
    }
};

// Update user data
const updateUserData = async (req, res) => {
    try {
        const userId = req.user.id; // Extracted from middleware
        console.log(userId);
        const { username, fullName, aboutMe, career } = req.body;
        const profilePhoto = req.file?.filename; // Image uploaded via Multer

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if username is already taken (by another user)
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                return res.status(409).json({ error: 'Username is already taken' });
            }
        }

        // Update user data
        user.username = username || user.username;
        user.fullName = fullName || user.fullName;
        user.aboutMe = aboutMe || user.aboutMe;
        user.career = career || user.career;
        if (profilePhoto) user.profilePhoto = profilePhoto; // Update profile photo if provided
        await user.save();

        res.status(200).json({ message: 'Profile updated successfully!' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// Check username availability
const checkUsernameAvailability = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        const existingUser = await User.findOne({ where: { username } });

        if (existingUser) {
            return res.status(409).json({ available: false });
        }

        res.status(200).json({ available: true });
    } catch (error) {
        console.error('Error checking username availability:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Exporting controller functions
module.exports = {
    fetchUserDataWithoutPosts,
    fetchUserDataWithPosts,
    updateUserData,
    checkUsernameAvailability,
};
