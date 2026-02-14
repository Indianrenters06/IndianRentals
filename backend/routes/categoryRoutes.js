const express = require('express');
const router = express.Router();
const {
    getCategories,
    getAdminCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCategories)
    .post(protect, admin, createCategory);

router.route('/admin')
    .get(protect, admin, getAdminCategories);

router.route('/:id')
    .put(protect, admin, updateCategory)
    .delete(protect, admin, deleteCategory);

module.exports = router;
