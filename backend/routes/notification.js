const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createNotificationValidator,
    notificationIdValidator
} = require('../middleware/validators');
const {
    getNotifications,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications
} = require('../controllers/notificationController');

router.route('/')
    .get(protect, getNotifications)
    .post(protect, authorize('admin'), createNotificationValidator, createNotification);

router.put('/read-all', protect, markAllAsRead);
router.delete('/clear-read', protect, clearReadNotifications);

router.route('/:id')
    .delete(protect, notificationIdValidator, deleteNotification);

router.put('/:id/read', protect, notificationIdValidator, markAsRead);

module.exports = router;
