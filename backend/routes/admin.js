const express = require('express');
const router = express.Router();
const { getUsers, deleteUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/users', protect, authorize('Admin', 'Super Admin'), getUsers);
router.delete('/users/:id', protect, authorize('Admin', 'Super Admin'), deleteUser);

module.exports = router;
