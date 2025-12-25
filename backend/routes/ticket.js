const express = require('express');
const router = express.Router();
const { getTickets, createTicket, updateTicket, deleteTicket } = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
    .get(authorize('Admin', 'Super Admin'), getTickets)
    .post(createTicket);

router.route('/:id')
    .put(authorize('Admin', 'Super Admin'), updateTicket)
    .delete(authorize('Admin', 'Super Admin'), deleteTicket);

module.exports = router;
