const express = require('express');
const { storePost, deletePost, getPostDetails } = require('../controllers/postController');
const { authenticateJWT } = require('../middlewares/authenticateJWT');

const router = express.Router();

router.post('/store', authenticateJWT ,storePost);
router.delete('/:postId', deletePost);
router.get('/:postId', getPostDetails);

module.exports = router;
