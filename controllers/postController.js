const { Post, Auth, Profile } = require("../models");
const { upload } = require("../middlewares/uploadPost");

const storePost = [
    upload.single("content"), async (req, res) => {
        try {
            const authId = req.auth.id; 
            const { caption } = req.body;

            if (!caption) {
                return res.status(400).json({ error: "Caption is required" });
            }

            if (!req.file) {
                return res.status(400).json({ error: "Please upload an image" });
            }

            const imageUrl = req.file.filename; 
            const post = await Post.create({
                userId: authId,
                caption,
                content: imageUrl,
            });

            res.status(201).json({
                message: "Post created successfully!",
                postId: post.id,
                imageUrl,
            });
        } catch (error) {
            console.error("Error creating post:", error);
            res.status(500).json({ error: "Error creating post. Please try again.", details: error.message });
        }
    },
];

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
                    model: Auth,
                    as: 'author', 
                    attributes: ['username'],
                },
                {
                    model: Profile,
                    as: 'authorProfile',
                    attributes: ['profilePhoto'],
                },
            ],
        });

        if (!post) {
            const errorResponse = { error: 'Post not found' };
            return res.status(404).json(errorResponse);
        }

        const responseData = {
            post: post.toJSON(),
        };

        return res.json(responseData);
    } catch (error) {
        const errorResponse = { error: 'Failed to retrieve post details', details: error.message };
        return res.status(500).json(errorResponse);
    }
};

module.exports = { storePost, deletePost, detailPost };
