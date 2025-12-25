const Ticket = require('../models/Ticket');
const User = require('../models/User');

// @desc    Get all tickets
// @route   GET /api/v1/tickets
// @access  Private (Admin)
exports.getTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        // Transform data to match frontend expectations
        const formattedTickets = tickets.map(ticket => ({
            id: ticket._id,
            status: ticket.status,
            subject: ticket.subject,
            message: ticket.message,
            fromName: ticket.user ? ticket.user.name : 'Unknown',
            fromEmail: ticket.user ? ticket.user.email : 'No Email',
            date: new Date(ticket.createdAt).toLocaleString(),
            priority: ticket.priority // if added to model later
        }));

        res.status(200).json({ success: true, data: formattedTickets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a ticket
// @route   POST /api/v1/tickets
// @access  Private
exports.createTicket = async (req, res) => {
    try {
        const ticket = await Ticket.create({
            user: req.user.id,
            subject: req.body.subject,
            message: req.body.message
        });
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update ticket status
// @route   PUT /api/v1/tickets/:id
// @access  Private (Admin)
exports.updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete ticket
// @route   DELETE /api/v1/tickets/:id
// @access  Private (Admin)
exports.deleteTicket = async (req, res) => {
    try {
        await Ticket.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Ticket deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
