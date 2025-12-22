const express = require('express');
const router = express.Router();
const { getInventory, addInventoryItem, receiveMaterial, dispatchMaterial } = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getInventory);
router.post('/', protect, addInventoryItem);
router.post('/receive', protect, receiveMaterial);
router.post('/dispatch', protect, dispatchMaterial);

module.exports = router;
