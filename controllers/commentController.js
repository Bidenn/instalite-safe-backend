const { Comment, Post } = require('../models');

// Create a new comment on a post
const createComment = async (req, res) => {
    try {
        const authId = req.auth.id; // Extracted from authentication middleware
        const { postId, content } = req.body; // Content of the comment and the associated post ID

        if (!postId || !content) {
            return res.status(400).json({ error: 'Post ID and comment content are required' });
        }

        // Check if the post exists
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Create the comment associated with the user and post
        const comment = await Comment.create({
            userId: authId,
            postId: postId,
            content: content,
        });

        res.status(201).json({ message: 'Comment created successfully!', comment });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Failed to create comment' });
    }
};

// Delete a comment by its creator (comment owner)
const deleteComment = async (req, res) => {
    try {
        const authId = req.auth.id; // Extracted from authentication middleware
        const { commentId } = req.params; // Comment ID to delete

        // Fetch the comment from the database
        const comment = await Comment.findByPk(commentId);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Check if the user is the creator of the comment
        if (comment.userId !== authId) {
            return res.status(403).json({ error: 'You are not authorized to delete this comment' });
        }

        // Delete the comment
        await comment.destroy();

        res.status(200).json({ message: 'Comment deleted successfully!' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Failed to delete comment' });
    }
};

const getPostComments = async (req, res) => {
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
        const commentCount = await Comment.count({
            where: { postId },
        });

        res.status(200).json({ commentCount });
    } catch (error) {
        console.error('Error getting post like count:', error);
        res.status(500).json({ error: 'Failed to fetch like count' });
    }
};

// Exporting controller functions
module.exports = {
    createComment,
    deleteComment,
    getPostComments
};
