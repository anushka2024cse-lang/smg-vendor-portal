const Order = require('../models/Order');
const { createAutoNotification } = require('../utils/notificationHelper');
const logger = require('../config/logger');

// @desc    Get all orders with filters
// @route   GET /api/v1/orders
// @access  Private
exports.getOrders = async (req, res) => {
    try {
        const { status, vendor, paymentStatus, startDate, endDate, search } = req.query;
        let query = {};

        // Apply filters
        if (status) query.status = status;
        if (vendor) query.vendor = vendor;
        if (paymentStatus) query.paymentStatus = paymentStatus;

        // Date range filter
        if (startDate && endDate) {
            query.orderDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Search by order number or notes
        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { notes: { $regex: search, $options: 'i' } },
                { trackingNumber: { $regex: search, $options: 'i' } }
            ];
        }

        const orders = await Order.find(query)
            .populate('vendor', 'name email contactPerson')
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email')
            .sort({ createdAt: -1 });

        logger.info(`Retrieved ${orders.length} orders`);

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        logger.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get single order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('vendor', 'name email contactPerson phone')
            .populate('purchaseOrderId')
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        logger.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private (Admin/VendorManager)
exports.createOrder = async (req, res) => {
    try {
        // Add creator to order data
        req.body.createdBy = req.user.id;

        const order = await Order.create(req.body);

        // Populate vendor info for notification
        await order.populate('vendor', 'name email');

        // Send notification to vendor
        await createAutoNotification({
            recipient: order.vendor._id,
            type: 'info',
            title: 'New Order Received',
            message: `Order ${order.orderNumber} has been placed for ${order.totalAmount.toFixed(2)}`,
            link: `/orders/${order._id}`,
            io: req.app.get('io')
        });

        logger.info(`Order created: ${order.orderNumber} by user ${req.user.id}`);

        res.status(201).json({
            success: true,
            order
        });
    } catch (error) {
        logger.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private (Admin/VendorManager)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, trackingNumber, actualDeliveryDate } = req.body;

        const updateData = {
            status,
            updatedBy: req.user.id
        };

        if (trackingNumber) updateData.trackingNumber = trackingNumber;
        if (actualDeliveryDate) updateData.actualDeliveryDate = actualDeliveryDate;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('vendor', 'name email')
            .populate('createdBy', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Send notification based on status
        let notificationMessage = '';
        let notificationType = 'info';

        switch (status) {
            case 'confirmed':
                notificationMessage = `Order ${order.orderNumber} has been confirmed`;
                notificationType = 'success';
                break;
            case 'in-transit':
                notificationMessage = `Order ${order.orderNumber} is now in transit${trackingNumber ? ` (Tracking: ${trackingNumber})` : ''}`;
                break;
            case 'delivered':
                notificationMessage = `Order ${order.orderNumber} has been delivered`;
                notificationType = 'success';
                break;
            case 'cancelled':
                notificationMessage = `Order ${order.orderNumber} has been cancelled`;
                notificationType = 'warning';
                break;
        }

        if (notificationMessage) {
            await createAutoNotification({
                recipient: order.createdBy._id,
                type: notificationType,
                title: `Order ${status}`,
                message: notificationMessage,
                link: `/orders/${order._id}`,
                io: req.app.get('io')
            });
        }

        logger.info(`Order ${order.orderNumber} status updated to ${status}`);

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        logger.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update payment status
// @route   PUT /api/v1/orders/:id/payment
// @access  Private (Admin/VendorManager)
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { paymentStatus, updatedBy: req.user.id },
            { new: true, runValidators: true }
        ).populate('vendor', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Notify vendor about payment status change
        if (paymentStatus === 'paid') {
            await createAutoNotification({
                recipient: order.vendor._id,
                type: 'success',
                title: 'Payment Received',
                message: `Payment for order ${order.orderNumber} has been processed`,
                link: `/orders/${order._id}`,
                io: req.app.get('io')
            });
        }

        logger.info(`Order ${order.orderNumber} payment status updated to ${paymentStatus}`);

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        logger.error('Error updating payment status:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Delete order
// @route   DELETE /api/v1/orders/:id
// @access  Private (Admin only)
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Only allow deletion if order is pending or cancelled
        if (order.status !== 'pending' && order.status !== 'cancelled') {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete order that is in progress or delivered'
            });
        }

        await order.deleteOne();

        logger.info(`Order ${order.orderNumber} deleted by user ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting order:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get order statistics
// @route   GET /api/v1/orders/stats
// @access  Private
exports.getOrderStats = async (req, res) => {
    try {
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        const paymentStats = await Order.aggregate([
            {
                $group: {
                    _id: '$paymentStatus',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            orderStats: stats,
            paymentStats
        });
    } catch (error) {
        logger.error('Error fetching order stats:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
