const express = require('express');
const router = express.Router();
const { getVendors, createVendor, getVendor, updateVendor, getVendorTransactions } = require('../controllers/vendorController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, getVendors)
    .post(protect, createVendor);

router.route('/:id')
    .get(protect, getVendor)
    .put(protect, updateVendor);

router.route('/:id/transactions')
    .get(protect, getVendorTransactions);

module.exports = router;
