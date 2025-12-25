const express = require('express');
const router = express.Router();
const { getVendors, createVendor, getVendor, updateVendor, getVendorTransactions, getVendorDocuments } = require('../controllers/vendorController');
const { protect } = require('../middleware/auth');
const uploadVendorDocs = require('../middleware/upload');

router.route('/')
    .get(protect, getVendors)
    .post(protect, uploadVendorDocs, createVendor);

router.route('/:id')
    .get(protect, getVendor)
    .put(protect, uploadVendorDocs, updateVendor);

router.route('/:id/transactions')
    .get(protect, getVendorTransactions);

router.route('/:id/documents')
    .get(protect, getVendorDocuments);

module.exports = router;
