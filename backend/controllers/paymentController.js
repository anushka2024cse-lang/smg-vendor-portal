const Payment = require('../models/Payment');
const { createAutoNotification } = require('../utils/notificationHelper');
const logger = require('../config/logger');

// @desc    Get all payments with filters
// @route   GET /api/v1/payments
// @access  Private
exports.getPayments = async (req, res) => {
    try {
        const { status, vendor, startDate, endDate, search, paymentMode } = req.query;
        let query = {};

        // Apply filters
        if (status) query.status = status;
        if (vendor) query.vendor = vendor;
        if (paymentMode && paymentMode !== '-') query.paymentMode = paymentMode;

        // Date range filter
        if (startDate && endDate) {
            query.invoiceDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Search filter
        if (search) {
            query.$or = [
                { paymentNumber: { $regex: search, $options: 'i' } },
                { invoiceNumber: { $regex: search, $options: 'i' } },
                { transactionReference: { $regex: search, $options: 'i' } }
            ];
        }

        const payments = await Payment.find(query)
            .populate('vendor', 'name email contactPerson')
            .populate('purchaseOrder', 'poNumber')
            .populate('createdBy', 'name email')
            .populate('approvalHistory.approvedBy', 'name')
            .sort({ createdAt: -1 });

        logger.info(`Retrieved ${payments.length} payments`);

        res.status(200).json({
            success: true,
            count: payments.length,
            payments
        });
    } catch (error) {
        logger.error('Error fetching payments:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get single payment by ID
// @route   GET /api/v1/payments/:id
// @access  Private
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('vendor', 'name email contactPerson phone bankDetails')
            .populate('purchaseOrder')
            .populate('createdBy', 'name email')
            .populate('approvalHistory.approvedBy', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                error: 'Payment not found'
            });
        }

        res.status(200).json({
            success: true,
            payment
        });
    } catch (error) {
        logger.error('Error fetching payment:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Create new payment
// @route   POST /api/v1/payments
// @access  Private (Admin/VendorManager)
exports.createPayment = async (req, res) => {
    try {
        // Add creator to payment data
        req.body.createdBy = req.user.id;

        const payment = await Payment.create(req.body);

        // Populate vendor info
        await payment.populate('vendor', 'name email');

        // Notify approvers (admin and finance users)
        await createAutoNotification({
            recipient: 'admin', // Send to all admins
            type: 'info',
            title: 'New Payment Request',
            message: `Payment ${payment.paymentNumber} created for ₹${payment.paymentAmount.toLocaleString()}`,
            link: `/payments`,
            io: req.app.get('io')
        });

        logger.info(`Payment created: ${payment.paymentNumber} by user ${req.user.id}`);

        res.status(201).json({
            success: true,
            payment
        });
    } catch (error) {
        logger.error('Error creating payment:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Approve payment
// @route   PUT /api/v1/payments/:id/approve
// @access  Private (Admin/Finance)
exports.approvePayment = async (req, res) => {
    try {
        const { comments } = req.body;

        const payment = await Payment.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('vendor', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                error: 'Payment not found'
            });
        }

        // Add to approval history
        payment.approvalHistory.push({
            approvedBy: req.user.id,
            level: payment.approvalHistory.length + 1,
            status: 'Approved',
            comments: comments || '',
            timestamp: Date.now()
        });

        payment.status = 'Approved';
        payment.updatedBy = req.user.id;
        await payment.save();

        // Notify creator
        await createAutoNotification({
            recipient: payment.createdBy._id,
            type: 'success',
            title: 'Payment Approved',
            message: `Payment ${payment.paymentNumber} has been approved`,
            link: `/payments`,
            io: req.app.get('io')
        });

        logger.info(`Payment ${payment.paymentNumber} approved by user ${req.user.id}`);

        res.status(200).json({
            success: true,
            payment
        });
    } catch (error) {
        logger.error('Error approving payment:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Reject payment
// @route   PUT /api/v1/payments/:id/reject
// @access  Private (Admin/Finance)
exports.rejectPayment = async (req, res) => {
    try {
        const { reason } = req.body;

        const payment = await Payment.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                error: 'Payment not found'
            });
        }

        // Add to approval history
        payment.approvalHistory.push({
            approvedBy: req.user.id,
            level: payment.approvalHistory.length + 1,
            status: 'Rejected',
            comments: reason || 'No reason provided',
            timestamp: Date.now()
        });

        payment.status = 'Rejected';
        payment.updatedBy = req.user.id;
        await payment.save();

        // Notify creator
        await createAutoNotification({
            recipient: payment.createdBy._id,
            type: 'error',
            title: 'Payment Rejected',
            message: `Payment ${payment.paymentNumber} was rejected. Reason: ${reason}`,
            link: `/payments`,
            io: req.app.get('io')
        });

        logger.info(`Payment ${payment.paymentNumber} rejected by user ${req.user.id}`);

        res.status(200).json({
            success: true,
            payment
        });
    } catch (error) {
        logger.error('Error rejecting payment:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Mark payment as processing
// @route   PUT /api/v1/payments/:id/process
// @access  Private (Admin/Finance)
exports.processPayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            { status: 'Processing', updatedBy: req.user.id },
            { new: true, runValidators: true }
        ).populate('vendor', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                error: 'Payment not found'
            });
        }

        logger.info(`Payment ${payment.paymentNumber} marked as processing`);

        res.status(200).json({
            success: true,
            payment
        });
    } catch (error) {
        logger.error('Error processing payment:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Mark payment as completed/paid
// @route   PUT /api/v1/payments/:id/complete
// @access  Private (Admin/Finance)
exports.completePayment = async (req, res) => {
    try {
        const { transactionReference, paymentMode, paymentDate } = req.body;

        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            {
                status: 'Paid',
                transactionReference: transactionReference || payment.transactionReference,
                paymentMode: paymentMode || payment.paymentMode,
                paymentDate: paymentDate || Date.now(),
                updatedBy: req.user.id
            },
            { new: true, runValidators: true }
        ).populate('vendor', 'name email')
            .populate('createdBy', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                error: 'Payment not found'
            });
        }

        // Notify both creator and vendor
        await createAutoNotification({
            recipient: payment.vendor._id,
            type: 'success',
            title: 'Payment Completed',
            message: `Payment ${payment.paymentNumber} of ₹${payment.netPayableAmount.toLocaleString()} has been processed`,
            link: `/payments`,
            io: req.app.get('io')
        });

        await createAutoNotification({
            recipient: payment.createdBy._id,
            type: 'success',
            title: 'Payment Completed',
            message: `Payment ${payment.paymentNumber} has been successfully processed`,
            link: `/payments`,
            io: req.app.get('io')
        });

        logger.info(`Payment ${payment.paymentNumber} completed`);

        res.status(200).json({
            success: true,
            payment
        });
    } catch (error) {
        logger.error('Error completing payment:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Delete payment
// @route   DELETE /api/v1/payments/:id
// @access  Private (Admin only)
exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                error: 'Payment not found'
            });
        }

        // Only allow deletion if payment is pending or rejected
        if (payment.status !== 'Pending' && payment.status !== 'Rejected') {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete payment that is approved or paid'
            });
        }

        await payment.deleteOne();

        logger.info(`Payment ${payment.paymentNumber} deleted by user ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Payment deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting payment:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get payment statistics
// @route   GET /api/v1/payments/stats
// @access  Private
exports.getPaymentStats = async (req, res) => {
    try {
        // Status-wise stats
        const statusStats = await Payment.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$paymentAmount' },
                    netPayable: { $sum: '$netPayableAmount' }
                }
            }
        ]);

        // Payment mode stats
        const modeStats = await Payment.aggregate([
            {
                $match: { status: 'Paid' }
            },
            {
                $group: {
                    _id: '$paymentMode',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$netPayableAmount' }
                }
            }
        ]);

        // Monthly trends (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTrends = await Payment.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo },
                    status: 'Paid'
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$paymentDate' },
                        month: { $month: '$paymentDate' }
                    },
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$netPayableAmount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Total stats
        const totalStats = await Payment.aggregate([
            {
                $group: {
                    _id: null,
                    totalPayments: { $sum: 1 },
                    totalAmount: { $sum: '$paymentAmount' },
                    totalNetPayable: { $sum: '$netPayableAmount' },
                    totalTDS: { $sum: '$tdsAmount' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            statusStats,
            modeStats,
            monthlyTrends,
            totalStats: totalStats[0] || {}
        });
    } catch (error) {
        logger.error('Error fetching payment stats:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Export payments to CSV
// @route   GET /api/v1/payments/export
// @access  Private
exports.exportPayments = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query;
        let query = {};

        if (status) query.status = status;
        if (startDate && endDate) {
            query.invoiceDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const payments = await Payment.find(query)
            .populate('vendor', 'name')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        // Generate CSV
        const csv = [
            'Payment Number,Invoice Number,Vendor,Invoice Date,Invoice Amount,Payment Amount,Net Payable,Status,Payment Mode,Transaction Ref,Payment Date,Created By',
            ...payments.map(p =>
                `${p.paymentNumber},${p.invoiceNumber},${p.vendor?.name || 'N/A'},${new Date(p.invoiceDate).toLocaleDateString()},${p.invoiceAmount},${p.paymentAmount},${p.netPayableAmount},${p.status},${p.paymentMode || '-'},${p.transactionReference || '-'},${p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '-'},${p.createdBy?.name || 'N/A'}`
            )
        ].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=payments-export-${Date.now()}.csv`);
        res.status(200).send(csv);

        logger.info(`Payments exported by user ${req.user.id}`);
    } catch (error) {
        logger.error('Error exporting payments:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Send payment request to vendor/client
// @route   POST /api/v1/payments/:id/send-request
// @access  Private (Admin/VendorManager)
exports.sendPaymentRequest = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('vendor', 'name email contactPerson phone')
            .populate('createdBy', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                error: 'Payment not found'
            });
        }

        // Create notification for vendor
        await createAutoNotification({
            recipient: payment.vendor._id,
            type: 'info',
            title: 'Payment Request',
            message: `Payment request ${payment.paymentNumber} for ₹${payment.netPayableAmount.toLocaleString()} - Invoice: ${payment.invoiceNumber}. Due: ${new Date(payment.dueDate).toLocaleDateString('en-IN')}`,
            link: `/payments`,
            io: req.app.get('io')
        });

        // TODO: Send email notification to vendor
        // This would integrate with email service (SendGrid, Nodemailer, etc.)
        logger.info(`Payment request sent for ${payment.paymentNumber} to vendor ${payment.vendor.name}`);

        res.status(200).json({
            success: true,
            message: 'Payment request sent successfully',
            payment
        });
    } catch (error) {
        logger.error('Error sending payment request:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
