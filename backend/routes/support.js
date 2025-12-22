const express = require('express');
const router = express.Router();
const { getTickets, createTicket } = require('../controllers/supportController');
const { protect } = require('../middleware/auth');

router.get('/tickets', protect, getTickets);
router.post('/tickets', protect, createTicket);

module.exports = router;
