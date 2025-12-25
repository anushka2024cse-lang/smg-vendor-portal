const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createWarrantyClaimValidator,
    warrantyIdValidator
} = require('../middleware/validators');
const {
    getAllClaims,
    getClaim,
    createClaim,
    updateClaim,
    approveClaim,
    rejectClaim,
    saveDraft,
    getDrafts,
    publishDraft,
    deleteClaim
} = require('../controllers/warrantyController');

// Protected routes
router.route('/')
    .get(protect, getAllClaims)
    .post(protect, createWarrantyClaimValidator, createClaim);

// Draft routes
router.post('/draft', protect, saveDraft);
router.get('/drafts', protect, getDrafts);
router.put('/:id/publish', protect, publishDraft);

router.route('/:id')
    .get(protect, getClaim)
    .patch(protect, updateClaim)
    .delete(protect, deleteClaim);

router.put('/:id/approve', protect, authorize('admin', 'vendorManager'), warrantyIdValidator, approveClaim);
router.put('/:id/reject', protect, authorize('admin', 'vendorManager'), warrantyIdValidator, rejectClaim);

module.exports = router;
