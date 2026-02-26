const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getSettings) // maybe protect, admin depending on if frontend needs it. Let's say frontend needs it for logo. Let's leave it public for GET.
    .put(protect, admin, updateSettings);

module.exports = router;
