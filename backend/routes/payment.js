const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getPayments,
    getPaymentById,
    createPayment,
    approvePayment,
    rejectPayment,
    processPayment,
    completePayment,
    deletePayment,
    getPaymentStats,
    exportPayments,
    sendPaymentRequest
} = require('../controllers/paymentController');

// All routes require authentication
router.use(protect);

// Public routes (all authenticated users)
router.get('/', getPayments);
router.get('/stats', getPaymentStats);
router.get('/export', exportPayments);
router.get('/:id', getPaymentById);

// Protected routes (admin and vendorManager can create)
router.post('/', authorize('admin', 'vendorManager'), createPayment);

// Payment workflow routes (admin and finance roles)
router.put('/:id/approve', authorize('admin', 'vendorManager'), approvePayment);
router.put('/:id/reject', authorize('admin', 'vendorManager'), rejectPayment);
router.put('/:id/process', authorize('admin', 'vendorManager'), processPayment);
router.put('/:id/complete', authorize('admin', 'vendorManager'), completePayment);
router.post('/:id/send-request', authorize('admin', 'vendorManager'), sendPaymentRequest);

// Delete (admin only)
router.delete('/:id', authorize('admin'), deletePayment);

module.exports = router;
