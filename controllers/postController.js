const Post = require('../models/Post');
const { upload } = require('../middlewares/uploadPost');
const User = require('../models/User');

exports.storePost = [
    upload.single('content'),
    async (req, res) => {
        try {
            const userId = req.user.id;
            const { caption } = req.body;

            if (!caption) {
                return res.status(400).json({ error: 'Caption is required' });
            }

            if (!req.file) {
                return res.status(400).json({ error: 'Please upload an image' });
            }

            const imageUrl = req.file.filename;
            const post = await Post.create({
                userId,
                caption,
                content: imageUrl,
            });

            res.status(201).json({
                message: 'Post created successfully!',
                postId: post.id,
                imageUrl,
            });
        } catch (error) {
            console.error('Error creating post:', error);
            res.status(500).json({ error: 'Error creating post. Please try again.', details: error.message });
        }
    }
];


exports.deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        // **Broken Access Control**: The function does not verify if the userId matches the post owner.
        const post = await Post.findOne({ where: { id: postId } });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // No check on whether the user is the owner of the post
        await Post.destroy({ where: { id: postId } });

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
};


exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve posts', details: error.message });
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.findAll({ where: { userId } });
        if (posts.length === 0) {
            return res.status(404).json({ error: 'No posts found for this user' });
        }
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve posts for this user', details: error.message });
    }
};

exports.getPostDetails = async (req, res) => {
    try {
        const { postId } = req.params;

        // Fetch the post along with the associated user (posterData)
        const post = await Post.findOne({
            where: { id: postId },
            include: {
                model: User, // Assuming the associated model is 'User'
                as: 'user', // Use the alias for the association
                attributes: ['id', 'username', 'profilePhoto'], // Adjust the attributes as needed
            },
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Respond with post details along with poster data
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve post details', details: error.message });
    }
};


