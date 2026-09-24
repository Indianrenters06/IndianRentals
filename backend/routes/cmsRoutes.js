const express = require('express');
const router = express.Router();
const { getAllPages, getPage, updatePage } = require('../controllers/cmsController');
const { protect, admin, hasPermission } = require('../middleware/authMiddleware');

// GET all pages list (admin panel)
router.get('/', protect, admin, hasPermission('cms'), getAllPages);

// GET / PUT a specific page by name  e.g. /api/cms/homepage
router.route('/:page')
    .get(getPage)                          // Public – so frontend can read it
    .put(protect, admin, hasPermission('cms'), updatePage);      // Admin only

module.exports = router;
