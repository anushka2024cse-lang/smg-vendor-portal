const express = require('express');
const router = express.Router();
const sparePartController = require('../controllers/sparePartController');

router.get('/stats', sparePartController.getStats);
router.get('/', sparePartController.getAllRequests);
router.get('/:id', sparePartController.getRequest);
router.post('/', sparePartController.createRequest);
router.patch('/:id', sparePartController.updateRequest);
router.delete('/:id', sparePartController.deleteRequest);

module.exports = router;
