const express = require('express');
const { getUserProfile, editUserProfile, updateUserProfile, checkUsername, getPublicProfile, searchPublicProfile } = require('../controllers/profileController');
const { authenticateJWT } = require('../middlewares/authenticateJWT');
const { upload } = require('../middlewares/uploadUser'); 

const router = express.Router();

router.get('/', authenticateJWT, getUserProfile);  
router.get('/edit', authenticateJWT, editUserProfile); 
router.put('/update', authenticateJWT, upload.single('photo'), updateUserProfile); 
router.get('/check-username', authenticateJWT , checkUsername);
router.get('/public/:username', authenticateJWT, getPublicProfile); 
router.get('/search/:username', authenticateJWT, searchPublicProfile);

module.exports = router;
