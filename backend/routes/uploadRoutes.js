const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage for Cloudinary direct upload
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'video/mp4', 'video/webm']);
const upload = multer({
    limits: { fileSize: 30 * 1024 * 1024, files: 10 },
    fileFilter: (_req, file, callback) => {
        if (!ALLOWED_TYPES.has(file.mimetype)) return callback(new Error('Unsupported media type'));
        callback(null, true);
    },
});

// @desc    Upload image(s) to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, admin, (req, res, next) => {
    upload.array('image')(req, res, (error) => {
        if (!error) return next();
        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Media files must be 30 MB or smaller' });
        }
        return res.status(400).json({ message: error.message || 'Upload failed' });
    });
}, async (req, res) => { // Supports single or multiple
    try {
        if (!req.files || req.files.length === 0) {
            // Fallback check if single file was sent improperly or without 'image' key
            if (req.file) req.files = [req.file]; // Should not happen with upload.array but safe
            else return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadToCloudinary = (file) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'indian-rentals',
                        resource_type: 'auto',
                    },
                    (error, result) => {
                        if (result) {
                            resolve(result.secure_url);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(file.buffer).pipe(stream);
            });
        };

        const imageUrls = await Promise.all(req.files.map(file => uploadToCloudinary(file)));

        res.json({
            message: 'Media uploaded successfully',
            images: imageUrls,
            image: imageUrls[0] // Backward compatibility
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
