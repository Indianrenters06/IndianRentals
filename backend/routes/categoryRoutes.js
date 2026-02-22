const express = require('express');
const router = express.Router();
const {
    getCategories,
    getSubcategories,
    getCategoryTree,
    getAdminCategories,
    createCategory,
    createSubcategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public Routes
router.get('/tree', getCategoryTree);                           // GET /api/categories/tree
router.get('/admin', protect, admin, getAdminCategories);      // GET /api/categories/admin (must be before /:id)

router.route('/')
    .get(getCategories)                                         // GET /api/categories
    .post(protect, admin, createCategory);                     // POST /api/categories

router.route('/:id')
    .put(protect, admin, updateCategory)                        // PUT /api/categories/:id
    .delete(protect, admin, deleteCategory);                   // DELETE /api/categories/:id

// Subcategory Routes
router.route('/:id/subcategories')
    .get(getSubcategories)                                      // GET /api/categories/:id/subcategories
    .post(protect, admin, createSubcategory);                  // POST /api/categories/:id/subcategories

module.exports = router;
