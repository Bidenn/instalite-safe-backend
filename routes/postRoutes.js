const express = require('express');
const { storePost, deletePost, detailPost } = require('../controllers/postController');
const { authenticateJWT } = require('../middlewares/authenticateJWT');

const router = express.Router();

router.post('/store', authenticateJWT, storePost);
router.delete('/:postId', authenticateJWT, deletePost); 
router.get('/:postId', authenticateJWT, detailPost);

module.exports = router;
