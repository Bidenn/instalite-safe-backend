const { Like, Post } = require('../models');

// Like a post
const likePost = async (req, res) => {
    try {
        const authId = req.auth.id; // Extracted from authentication middleware
        const { postId } = req.body; // The post to be liked

        if (!postId) {
            return res.status(400).json({ error: 'Post ID is required' });
        }

        // Check if the post exists
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the user has already liked the post
        const existingLike = await Like.findOne({
            where: { authId, postId },
        });

        if (existingLike) {
            return res.status(400).json({ error: 'You have already liked this post' });
        }

        // Create a like record
        await Like.create({
            userId: authId,
            postId: postId,
        });

        res.status(201).json({ message: 'Post liked successfully!' });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Failed to like post' });
    }
};

// Unlike a post
const unlikePost = async (req, res) => {
    try {
        const authId = req.auth.id; // Extracted from authentication middleware
        const { postId } = req.body; // The post to be unliked

        if (!postId) {
            return res.status(400).json({ error: 'Post ID is required' });
        }

        // Check if the post exists
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Check if the user has liked the post
        const existingLike = await Like.findOne({
            where: { authId, postId },
        });

        if (!existingLike) {
            return res.status(400).json({ error: 'You have not liked this post' });
        }

        // Remove the like record
        await existingLike.destroy();

        res.status(200).json({ message: 'Post unliked successfully!' });
    } catch (error) {
        console.error('Error unliking post:', error);
        res.status(500).json({ error: 'Failed to unlike post' });
    }
};

// Get the number of likes for a post
const getPostLikes = async (req, res) => {
    try {
        const { postId } = req.params; // Post ID for which to get the like count

        if (!postId) {
            return res.status(400).json({ error: 'Post ID is required' });
        }

        // Check if the post exists
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Get the like count for the post
        const likeCount = await Like.count({
            where: { postId },
        });

        res.status(200).json({ likeCount });
    } catch (error) {
        console.error('Error getting post like count:', error);
        res.status(500).json({ error: 'Failed to fetch like count' });
    }
};

// Exporting controller functions
module.exports = {
    likePost,
    unlikePost,
    getPostLikes,
};
