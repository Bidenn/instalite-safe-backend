const express = require('express');
const { storePost, deletePost, detailPost } = require('../controllers/postController');
const { toggleLikePost } = require('../controllers/likeController');
const { storeComment, deleteComment } = require('../controllers/commentController');
const { authenticateJWT } = require('../middlewares/authenticateJWT');
const { upload } = require('../middlewares/uploadPost');
const router = express.Router();

router.get('/:postId', authenticateJWT, detailPost);
router.post('/store', authenticateJWT, upload.single('content'), storePost);
router.delete('/:postId', authenticateJWT, deletePost); 

router.post('/toggle-like', authenticateJWT, toggleLikePost);

router.post('/:postId/comment', authenticateJWT, storeComment); 
router.delete('/comment/:commentId', authenticateJWT, deleteComment); 

module.exports = router;