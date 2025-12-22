const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
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
    .post(protect, authorize('admin'), createNotification);

router.put('/read-all', protect, markAllAsRead);
router.delete('/clear-read', protect, clearReadNotifications);

router.route('/:id')
    .delete(protect, deleteNotification);

router.put('/:id/read', protect, markAsRead);

module.exports = router;
