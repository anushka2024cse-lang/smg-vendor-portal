const express = require('express');
const router = express.Router();
const rsaController = require('../controllers/rsaController');

router.get('/stats', rsaController.getStats);
router.get('/', rsaController.getAllRequests);
router.get('/:id', rsaController.getRequest);
router.post('/', rsaController.createRequest);
router.patch('/:id', rsaController.updateRequest);
router.delete('/:id', rsaController.deleteRequest);

module.exports = router;
