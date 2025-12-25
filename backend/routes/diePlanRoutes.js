const express = require('express');
const router = express.Router();
const diePlanController = require('../controllers/diePlanController');

router.get('/stats', diePlanController.getStats);
router.get('/', diePlanController.getAllPlans);
router.get('/:id', diePlanController.getPlan);
router.post('/', diePlanController.createPlan);
router.patch('/:id', diePlanController.updatePlan);
router.delete('/:id', diePlanController.deletePlan);

module.exports = router;
