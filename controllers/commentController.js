const Comment = require('../models/Comment'); 
const Post = require('../models/Post');
const User = require('../models/User');

const storeComment = async (req, res) => {
    console.log(req);
    try {
        const authId = req.auth.id; 
        const { postId, comment } = req.body;

        const post = await Post.findByPk(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const newComment = await Comment.create({
            postId : postId,
            userId : authId,
            text: comment,
        });

        return res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteComment = async (req, res) => {
    try {
        const authId = req.auth.id; 
        const { commentId } = req.params;

        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.userId !== authId) {
            return res.status(403).json({ error: "You are not authorized to delete this comment" });
        }

        await comment.destroy();

        return res.status(200).json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { storeComment, deleteComment };
