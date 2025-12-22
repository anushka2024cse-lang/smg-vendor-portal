const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createWarrantyClaimValidator,
    warrantyIdValidator
} = require('../middleware/validators');
const {
    getAllClaims,
    createClaim,
    approveClaim,
    rejectClaim
} = require('../controllers/warrantyController');

// Protected routes
router.route('/')
    .get(protect, getAllClaims)
    .post(protect, createWarrantyClaimValidator, createClaim);

router.put('/:id/approve', protect, authorize('admin', 'vendorManager'), warrantyIdValidator, approveClaim);
router.put('/:id/reject', protect, authorize('admin', 'vendorManager'), warrantyIdValidator, rejectClaim);

module.exports = router;
