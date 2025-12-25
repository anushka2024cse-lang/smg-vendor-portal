const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, createUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin', 'superAdmin'));

router.route('/users')
    .get(getUsers)
    .post(createUser);

router.route('/users/:id')
    .delete(deleteUser);

module.exports = router;
