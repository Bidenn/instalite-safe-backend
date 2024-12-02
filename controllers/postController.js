const { Post, Auth, Profile, Comment, Like } = require("../models");
const { upload } = require("../middlewares/uploadPost");

// Store new post
const storePost = [
    upload.single("content"), async (req, res) => {
        try {
            const authId = req.auth.id; // The ID of the authenticated user making the request
            const { caption } = req.body;

            // Validate caption
            if (!caption) {
                return res.status(400).json({ error: "Caption is required" });
            }

            // Validate file upload
            if (!req.file) {
                return res.status(400).json({ error: "Please upload an image" });
            }

            const imageUrl = req.file.filename; // File name of the uploaded image
            // Create a new post entry in the database
            const post = await Post.create({
                userId: authId,
                caption,
                content: imageUrl,
            });

            // Respond with success message and post ID
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

// Delete post (only the post creator can delete)
const deletePost = async (req, res) => {
    try {
        const { postId } = req.params; // Post ID to be deleted
        const authId = req.auth.id; // ID of the authenticated user making the request

        // Find the post by ID
        const post = await Post.findOne({ where: { id: postId } });

        // Check if the post exists
        if (!post) {
        return res.status(404).json({ error: "Post not found" });
        }

        // **Access Control**: Ensure that only the post creator (authId) can delete the post
        if (post.userId !== authId) {
        return res.status(403).json({ error: "You are not authorized to delete this post" });
        }

        // Delete the post if the user is the creator
        await Post.destroy({ where: { id: postId } });

        // Respond with success message
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Failed to delete post" });
    }
};

// Get post details along with the creator's profile info
const detailPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const loggedUserId = req.userId; // Assuming `req.userId` contains the logged-in user's ID.

        // Fetch the post along with the associated user (posterData)
        const post = await Post.findOne({
            where: { id: postId },
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
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Fetch comments along with author data and profile photos
        const comments = await Comment.findAll({
            where: { postId },
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

        // Check if the logged-in user has liked the post
        const likeRecord = await Like.findOne({
            where: { postId, userId: loggedUserId },
        });
        const isLiked = !!likeRecord; // Convert to boolean

        // Return the combined data
        res.json({
            post: {
                ...post.toJSON(),
                author: post.author,
                authorProfile: post.authorProfile,
            },
            comments: comments.map(comment => ({
                ...comment.toJSON(),
                author: comment.author,
                authorProfile: comment.authorProfile,
            })),
            isLiked,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve post details", details: error.message });
    }
};

// Export the controller functions
module.exports = { storePost, deletePost, detailPost };
