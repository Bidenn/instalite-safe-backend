const Like = require('../models/Like'); 
const Post = require('../models/Post');

const toggleLikePost = async (req, res) => {
    try {
        const authId = req.auth.id; 
        const { postId } = req.body;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const existingLike = await Like.findOne({
            where: {
                postId,
                userId: authId,
            },
        });

        if (existingLike) {
            await existingLike.destroy();
            return res.status(200).json({ success: true, message: 'Post unliked successfully' });
        } else {
            const newLike = await Like.create({
                postId,
                userId: authId,
            });
            return res.status(201).json({ success: true, like: newLike, message: 'Post liked successfully' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { toggleLikePost };
