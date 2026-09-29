const express = require('express');
const router = express.Router();
const { getAllPages, getPage, getDraftPage, updatePage, publishPage, discardDraft, getPreviewToken, getPreviewPage } = require('../controllers/cmsController');
const { protect, admin, hasPermission } = require('../middleware/authMiddleware');

// GET all pages list (admin panel)
router.get('/', protect, admin, hasPermission('cms'), getAllPages);

router.get('/:page/draft', protect, admin, hasPermission('cms'), getDraftPage);
router.post('/:page/publish', protect, admin, hasPermission('cms'), publishPage);
router.delete('/:page/draft', protect, admin, hasPermission('cms'), discardDraft);
router.post('/:page/preview-token', protect, admin, hasPermission('cms'), getPreviewToken);
router.get('/:page/preview', getPreviewPage);

// GET / PUT a specific page by name  e.g. /api/cms/homepage
router.route('/:page')
    .get(getPage)                          // Public – so frontend can read it
    .put(protect, admin, hasPermission('cms'), updatePage);      // Admin only

module.exports = router;
