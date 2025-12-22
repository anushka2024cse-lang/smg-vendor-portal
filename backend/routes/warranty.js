const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllClaims,
    createClaim,
    approveClaim,
    rejectClaim
} = require('../controllers/warrantyController');

// Protected routes
router.route('/')
    .get(protect, getAllClaims)
    .post(protect, createClaim);

router.put('/:id/approve', protect, authorize('admin', 'vendorManager'), approveClaim);
router.put('/:id/reject', protect, authorize('admin', 'vendorManager'), rejectClaim);

module.exports = router;
