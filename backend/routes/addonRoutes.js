const express = require('express');
const router = express.Router();
const {
    getAddons,
    createAddon,
    updateAddon,
    deleteAddon
} = require('../controllers/addonController');
const { protect, admin, hasPermission } = require('../middleware/authMiddleware');

router.route('/')
    .get(getAddons)
    .post(protect, admin, hasPermission('products'), createAddon);

router.route('/:id')
    .put(protect, admin, hasPermission('products'), updateAddon)
    .delete(protect, admin, hasPermission('products'), deleteAddon);

module.exports = router;
