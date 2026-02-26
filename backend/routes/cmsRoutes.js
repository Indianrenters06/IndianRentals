const express = require('express');
const router = express.Router();
const { getHomepageCMS, updateHomepageCMS } = require('../controllers/cmsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/homepage')
    .get(getHomepageCMS) // Allow public to get it? Or maybe protect it. Let's let anyone GET it so frontend can build.
    .put(protect, admin, updateHomepageCMS);

module.exports = router;
