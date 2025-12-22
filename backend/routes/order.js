const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    getOrderStats
} = require('../controllers/orderController');

// All routes require authentication
router.use(protect);

// Public routes (all authenticated users)
router.get('/', getOrders);
router.get('/stats', getOrderStats);
router.get('/:id', getOrderById);

// Protected routes (admin and vendorManager only)
router.post('/', authorize('admin', 'vendorManager'), createOrder);
router.put('/:id/status', authorize('admin', 'vendorManager'), updateOrderStatus);
router.put('/:id/payment', authorize('admin', 'vendorManager'), updatePaymentStatus);
router.delete('/:id', authorize('admin'), deleteOrder);

module.exports = router;
