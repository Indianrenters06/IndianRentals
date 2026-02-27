const express = require('express');
const router = express.Router();
const { getAllPages, getPage, updatePage } = require('../controllers/cmsController');
const { protect, admin } = require('../middleware/authMiddleware');

// GET all pages list (admin panel)
router.get('/', protect, admin, getAllPages);

// GET / PUT a specific page by name  e.g. /api/cms/homepage
router.route('/:page')
    .get(getPage)                          // Public – so frontend can read it
    .put(protect, admin, updatePage);      // Admin only

module.exports = router;
