const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllSORs,
    getSOR,
    createSOR,
    updateSOR,
    deleteSOR,
    submitSOR,
    approveSOR,
    getSORHistory
} = require('../controllers/sorController');

// Basic CRUD routes
router.route('/')
    .get(getAllSORs)
    .post(protect, createSOR);

router.route('/:id')
    .get(getSOR)
    .put(protect, updateSOR)
    .delete(protect, authorize('admin', 'vendorManager'), deleteSOR);

// Workflow routes
router.post('/:id/submit', protect, submitSOR);
router.post('/:id/approve', protect, authorize('admin', 'vendorManager'), approveSOR);
router.get('/:id/history', protect, getSORHistory);

module.exports = router;
