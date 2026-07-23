const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage — files are streamed directly to Cloudinary, never saved to disk
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image\/(jpeg|jpg|png)|application\/pdf/.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Images (JPG/PNG) and PDFs only!'));
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
});

/**
 * Upload a single file buffer to Cloudinary.
 * Returns the secure_url string.
 * `folder` defaults to the KYC folder so existing callers are unaffected.
 */
const uploadToCloudinary = (fileBuffer, fieldName, folder = 'indian-rentals/kyc') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'auto',
                public_id: `${fieldName}-${Date.now()}`,
            },
            (error, result) => {
                if (result) {
                    resolve(result.secure_url);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

module.exports = upload;
module.exports.uploadToCloudinary = uploadToCloudinary;
