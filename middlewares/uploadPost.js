const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/posts/';

        // Ensure upload folder exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        // Set the folder to store the file
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Sanitize the file name and create a unique file name
        const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-_]/g, '');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(sanitizedFileName)); // Ensure unique file names
    }
});

// File type validation (only allow images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|gif|webp/; // Allowed image file extensions
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true); // Accept the file
    } else {
        return cb(new Error('Invalid file type. Only images are allowed.'), false); // Reject the file
    }
};

// File size limitation (e.g., 5MB)
const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB

// Initialize multer with storage, file filter, and limits
const upload = multer({ storage: storage, fileFilter: fileFilter, limits: limits });

// Export multer middleware for use in routes
module.exports = { upload };
