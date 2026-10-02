const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    uploadProductsBulk,
    updateProductFaqs,
    updateProductVariants,
} = require('../controllers/productController');
const { protect, admin, hasPermission } = require('../middleware/authMiddleware');

const { rateLimit } = require('express-rate-limit');
const searchLimit = rateLimit({ windowMs: 60000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false });
const reviewLimit = rateLimit({ windowMs: 15 * 60000, limit: 10, keyGenerator: req => String(req.user._id), standardHeaders: 'draft-8', legacyHeaders: false });
const upload = multer();

router.route('/')
    .get(searchLimit, getProducts)
    .post(protect, admin, hasPermission('products'), createProduct);

router.route('/bulk')
    .post(protect, admin, hasPermission('products'), upload.single('file'), uploadProductsBulk);

router.route('/:id/reviews').post(protect, reviewLimit, createProductReview);
router.route('/:id/faqs').patch(protect, admin, hasPermission('products'), updateProductFaqs);
router.route('/:id/variants').patch(protect, admin, hasPermission('products'), updateProductVariants);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, hasPermission('products', 'cms'), updateProduct) // CMS > Product Page edits product content too
    .delete(protect, admin, hasPermission('products'), deleteProduct);

module.exports = router;
