const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get all notifications for admin (sorted by newest, paginated optionally)
// @route   GET /api/notifications
// @access  Private/Admin
exports.getNotifications = asyncHandler(async (req, res) => {
    // Only get last 50 for performance
    const notifications = await Notification.find({}).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private/Admin
exports.getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({ isRead: false });
    res.json({ count });
});

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private/Admin
exports.markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private/Admin
exports.markAllAsRead = asyncHandler(async (req, res) => {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
});

// Helper function to create notification internally from other controllers
exports.createNotification = async ({ title, message, type, relatedId }) => {
    try {
        await Notification.create({ title, message, type, relatedId });
    } catch (err) {
        console.error('Failed to create notification', err);
    }
};
