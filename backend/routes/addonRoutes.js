const express = require('express');
const router = express.Router();
const {
    getAddons,
    createAddon,
    updateAddon,
    deleteAddon
} = require('../controllers/addonController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getAddons)
    .post(protect, admin, createAddon);

router.route('/:id')
    .put(protect, admin, updateAddon)
    .delete(protect, admin, deleteAddon);

module.exports = router;
