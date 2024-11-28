// postOwnership.js
const Post = require('../models/Post');

const checkPostOwnership = async (req, res, next) => {
    const { postId } = req.params;
    const userId = req.user; // Get the logged-in user's ID from the JWT token

    try {
        // Find the post by ID
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        // Check if the logged-in user is the owner of the post
        if (post.userId !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this post.' });
        }

        // If the user is authorized, proceed
        next();
    } catch (error) {
        console.error('Error checking post ownership:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { checkPostOwnership };
