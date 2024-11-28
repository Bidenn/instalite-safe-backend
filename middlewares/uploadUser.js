const multer = require('multer');
const path = require('path');

// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/users/'); // Set your upload folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Ensure unique file names
    }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

// Export multer middleware for use in routes
module.exports = { upload };
