const Notification = require('../models/Notification');

// @desc    Get all notifications for logged-in user
// @route   GET /api/v1/notifications
// @access  Private
exports.getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20, unreadOnly = false } = req.query;

        // Build filter
        const filter = { recipient: req.user?.id || 'temp-user-id' };
        if (unreadOnly === 'true') {
            filter.isRead = false;
        }

        const skip = (page - 1) * limit;

        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Notification.countDocuments(filter);
        const unreadCount = await Notification.countDocuments({
            recipient: req.user?.id || 'temp-user-id',
            isRead: false
        });

        res.status(200).json({
            success: true,
            count: notifications.length,
            total,
            unreadCount,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: notifications
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Create new notification
// @route   POST /api/v1/notifications
// @access  Public (should be private/admin)
exports.createNotification = async (req, res) => {
    try {
        const notification = await Notification.create(req.body);

        // Emit Socket.IO event for real-time notification
        const io = req.app.get('io');
        io.emit('new-notification', notification);

        res.status(201).json({
            success: true,
            message: 'Notification created',
            data: notification
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Notification not found'
            });
        }

        notification.isRead = true;
        notification.readAt = new Date();
        await notification.save();

        res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            data: notification
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            { recipient: req.user?.id || 'temp-user-id', isRead: false },
            { isRead: true, readAt: new Date() }
        );

        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} notifications marked as read`,
            count: result.modifiedCount
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted',
            data: {}
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Delete all read notifications
// @route   DELETE /api/v1/notifications/clear-read
// @access  Private
exports.clearReadNotifications = async (req, res) => {
    try {
        const result = await Notification.deleteMany({
            recipient: req.user?.id || 'temp-user-id',
            isRead: true
        });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} notifications cleared`,
            count: result.deletedCount
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Utility function to create notification (used by other controllers)
exports.createNotificationUtil = async (recipientId, type, title, message, link = null, metadata = {}) => {
    try {
        const notification = await Notification.create({
            recipient: recipientId,
            type,
            title,
            message,
            link,
            metadata
        });

        // TODO: Emit socket.io event
        // io.to(recipientId).emit('new-notification', notification);

        return notification;
    } catch (err) {
        console.error('Error creating notification:', err);
        return null;
    }
};
