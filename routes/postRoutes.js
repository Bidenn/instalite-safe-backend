const express = require('express');
const { storePost, deletePost, detailPost } = require('../controllers/postController');
const { likePost, unlikePost, getPostLikes } = require('../controllers/likeController');
const { createComment, deleteComment, getPostComments } = require('../controllers/commentController');
const { authenticateJWT } = require('../middlewares/authenticateJWT');

const router = express.Router();

// Post routes
router.post('/store', authenticateJWT, storePost); // Create a new post
router.delete('/:postId', authenticateJWT, deletePost); // Delete a post
router.get('/:postId', authenticateJWT, detailPost); // Get post details along with user profile info

// Like routes
router.post('/:postId/like', authenticateJWT, likePost); // Like a post
router.delete('/:postId/like', authenticateJWT, unlikePost); // Unlike a post
router.get('/:postId/likes', getPostLikes); // Get like count for a post

// Comment routes
router.post('/:postId/comment', authenticateJWT, createComment); // Create a comment on a post
router.delete('/comment/:commentId', authenticateJWT, deleteComment); // Delete a comment
router.get('/:postId/comment', getPostComments); // Get like count for a post

module.exports = router;
