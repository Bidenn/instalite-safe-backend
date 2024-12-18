const { Post, User, Like, Comment } = require("../models");

const storePost = async (req, res) => {
    try {
        const authId = req.auth.id; 
        const { caption } = req.body;

        if (!caption) {
            return res.status(400).json({ error: 'Caption is required' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const imageUrl = req.file.filename;

        Post.create({
            userId: authId,
            caption,
            content: imageUrl,
        });

        res.status(201).json({
            message: 'Post created successfully!',
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "Failed to update profile" });
    }
};

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const authId = req.auth.id;

        const post = await Post.findOne({ where: { id: postId } });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.userId !== authId) {
            return res.status(403).json({ error: "You are not authorized to delete this post" });
        }

        await Post.destroy({ where: { id: postId } });

        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Failed to delete post" });
    }
};

const detailPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findOne({
            where: { id: postId },
            include: [
                {
                    model: User,
                    as: 'author', 
                    attributes: ['username', 'photo'],
                },
            ],
        });

        if (!post) {
            const errorResponse = { error: 'Post not found' };
            return res.status(404).json(errorResponse);
        }

        const comments = await Comment.findAll({
            where: { postId: postId },
            include: {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'photo'], 
            }
        });

        const likes = await Like.findAll({
            where: { postId: postId }
        });

        const totalLikes = likes.length;

        const responseData = {
            post: post,
            comments: comments,
            totalLikes: totalLikes
        };
        return res.status(201).json(responseData);
    } catch (error) {
        const errorResponse = { error: 'Failed to retrieve post details', details: error.message };
        return res.status(500).json(errorResponse);
    }
};

module.exports = { storePost, deletePost, detailPost };