const { Auth, Profile, Post, Mutual } = require('../models');
const { Op } = require('sequelize');

// Fetch homepage data with all posts
const getHomepageData = async (req, res) => {
    try {
        const authId = req.auth.id; // The logged-in user ID

        // Fetch logged-in user data (username)
        const loggedUser = await Auth.findByPk(authId, {
            attributes: ['username'],
        });

        if (!loggedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch profile photo for the logged-in user
        const loggedUserProfile = await Profile.findOne({
            where: { userId: authId },
            attributes: ['profilePhoto'],
        });

        // Fetch all posts, including author data (username and profile photo)
        const posts = await Post.findAll({
            include: [
                {
                    model: Auth,
                    as: 'author', // Use alias defined in the model
                    attributes: ['username'],
                },
                {
                    model: Profile,
                    as: 'authorProfile', // Alias for the Profile model (ensure this matches the association)
                    attributes: ['profilePhoto'],
                },
            ],
            order: [['createdAt', 'DESC']], // Order posts by latest
        });

        // Prepare the response data
        const response = {
            loggedUser: {
                username: loggedUser.username,
                profilePhoto: loggedUserProfile ? loggedUserProfile.profilePhoto : null,
            },
            posts: posts.map(post => ({
                id: post.id,
                caption: post.caption,
                content: post.content,
                createdAt: post.createdAt,
                username: post.author.username,
                profilePhoto: post.authorProfile ? post.authorProfile.profilePhoto : null, // Fetch the profile photo of the author
            })),
        };

        // Send the response back to the client
        res.json(response);
    } catch (error) {
        console.error('Error fetching homepage data:', error);
        res.status(500).json({ error: 'Failed to fetch homepage data' });
    }
};

// Exporting controller functions
module.exports = {
    getHomepageData,
};
