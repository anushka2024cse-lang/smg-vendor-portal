const express = require('express');
const router = express.Router();
const hsrpController = require('../controllers/hsrpController');

router.get('/stats', hsrpController.getStats);
router.get('/', hsrpController.getAllRequests);
router.get('/:id', hsrpController.getRequest);
router.post('/', hsrpController.createRequest);
router.patch('/:id', hsrpController.updateRequest);
router.delete('/:id', hsrpController.deleteRequest);

module.exports = router;
