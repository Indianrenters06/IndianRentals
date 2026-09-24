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
const { protect, admin, hasPermission } = require('../middleware/authMiddleware');

// Public Routes
router.get('/tree', getCategoryTree);                           // GET /api/categories/tree
router.get('/admin', protect, admin, hasPermission('products'), getAdminCategories);      // GET /api/categories/admin (must be before /:id)

router.route('/')
    .get(getCategories)                                         // GET /api/categories
    .post(protect, admin, hasPermission('products'), createCategory);                     // POST /api/categories

router.route('/:id')
    .put(protect, admin, hasPermission('products'), updateCategory)                        // PUT /api/categories/:id
    .delete(protect, admin, hasPermission('products'), deleteCategory);                   // DELETE /api/categories/:id

// Subcategory Routes
router.route('/:id/subcategories')
    .get(getSubcategories)                                      // GET /api/categories/:id/subcategories
    .post(protect, admin, hasPermission('products'), createSubcategory);                  // POST /api/categories/:id/subcategories

module.exports = router;
