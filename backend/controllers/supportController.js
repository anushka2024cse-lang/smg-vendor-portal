const Ticket = require('../models/Ticket');

// @desc    Get user tickets
// @route   GET /api/v1/support/tickets
// @access  Private
exports.getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find({ user: req.user.id });
        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create new ticket
// @route   POST /api/v1/support/tickets
// @access  Private
exports.createTicket = async (req, res) => {
    try {
        const { subject, message } = req.body;
        const ticket = await Ticket.create({
            user: req.user.id,
            subject,
            message
        });
        res.status(201).json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
