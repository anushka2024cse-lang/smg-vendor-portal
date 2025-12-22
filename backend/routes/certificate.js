const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getCertificates,
    getCertificateById,
    createCertificate,
    updateCertificate,
    deleteCertificate,
    getCertificateStats
} = require('../controllers/certificateController');

// All routes require authentication
router.use(protect);

// Public routes (all authenticated users)
router.get('/', getCertificates);
router.get('/stats', getCertificateStats);
router.get('/:id', getCertificateById);

// Protected routes (admin and vendorManager can create/update)
router.post('/', authorize('admin', 'vendorManager'), createCertificate);
router.put('/:id', authorize('admin', 'vendorManager'), updateCertificate);

// Delete (admin only)
router.delete('/:id', authorize('admin'), deleteCertificate);

module.exports = router;
