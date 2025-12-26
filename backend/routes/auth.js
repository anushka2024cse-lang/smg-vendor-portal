const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, adminLogin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
    loginValidator,
    registerValidator,
    updateProfileValidator
} = require('../middleware/validators');

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/admin-login', adminLogin);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfileValidator, updateProfile);

module.exports = router;
