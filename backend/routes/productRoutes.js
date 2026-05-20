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
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const upload = multer();

router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);

router.route('/bulk')
    .post(protect, admin, upload.single('file'), uploadProductsBulk);

router.route('/:id/reviews').post(createProductReview);
router.route('/:id/faqs').patch(protect, admin, updateProductFaqs);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;
