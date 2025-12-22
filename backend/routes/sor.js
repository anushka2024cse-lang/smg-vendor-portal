const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createSORValidator,
    updateSORValidator,
    sorIdValidator
} = require('../middleware/validators');
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
    .post(protect, createSORValidator, createSOR);

router.route('/:id')
    .get(sorIdValidator, getSOR)
    .put(protect, updateSORValidator, updateSOR)
    .delete(protect, authorize('admin', 'vendorManager'), sorIdValidator, deleteSOR);

// Workflow routes
router.post('/:id/submit', protect, sorIdValidator, submitSOR);
router.post('/:id/approve', protect, authorize('admin', 'vendorManager'), sorIdValidator, approveSOR);
router.get('/:id/history', protect, sorIdValidator, getSORHistory);

module.exports = router;
