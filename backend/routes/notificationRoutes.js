const express = require('express');
const router = express.Router();
const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getNotifications);

router.route('/unread-count')
    .get(protect, admin, getUnreadCount);

router.route('/read-all')
    .put(protect, admin, markAllAsRead);

router.route('/:id/read')
    .put(protect, admin, markAsRead);

module.exports = router;
