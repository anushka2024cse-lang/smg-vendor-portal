const Notification = require('../models/Notification');

// Notification templates for different events
const notificationTemplates = {
    // SOR Notifications
    SOR_CREATED: (data) => ({
        type: 'info',
        title: 'New SOR Created',
        message: `SOR #${data.sorNumber} created by ${data.creatorName}`,
        link: `/sor/workspace/${data.sorId}`
    }),

    SOR_SUBMITTED: (data) => ({
        type: 'info',
        title: 'SOR Submitted for Approval',
        message: `SOR #${data.sorNumber} has been submitted and awaits approval`,
        link: `/sor/workspace/${data.sorId}`
    }),

    SOR_APPROVED: (data) => ({
        type: 'success',
        title: 'SOR Approved! ✅',
        message: `Your SOR #${data.sorNumber} has been approved${data.approverName ? ` by ${data.approverName}` : ''}`,
        link: `/sor/workspace/${data.sorId}`
    }),

    SOR_REJECTED: (data) => ({
        type: 'error',
        title: 'SOR Rejected',
        message: `SOR #${data.sorNumber} was rejected. ${data.reason ? `Reason: ${data.reason}` : 'Please review and resubmit.'}`,
        link: `/sor/workspace/${data.sorId}`
    }),

    // Purchase Order Notifications
    PO_CREATED: (data) => ({
        type: 'info',
        title: 'New Purchase Order Created',
        message: `PO #${data.poNumber} created for ${data.vendorName}`,
        link: `/purchase-orders/${data.poId}`
    }),

    PO_APPROVED: (data) => ({
        type: 'success',
        title: 'Purchase Order Approved',
        message: `PO #${data.poNumber} has been approved. Total: ${data.amount}`,
        link: `/purchase-orders/${data.poId}`
    }),

    PO_DELIVERED: (data) => ({
        type: 'success',
        title: 'PO Delivered',
        message: `Items from PO #${data.poNumber} have been delivered`,
        link: `/purchase-orders/${data.poId}`
    }),

    // Payment Notifications
    PAYMENT_INITIATED: (data) => ({
        type: 'info',
        title: 'Payment Initiated',
        message: `Payment of ${data.amount} initiated for ${data.vendorName}`,
        link: `/payments/${data.paymentId}`
    }),

    PAYMENT_APPROVED: (data) => ({
        type: 'success',
        title: 'Payment Approved',
        message: `Payment of ${data.amount} has been approved`,
        link: `/payments/${data.paymentId}`
    }),

    PAYMENT_PROCESSED: (data) => ({
        type: 'success',
        title: 'Payment Processed ✅',
        message: `Payment of ${data.amount} has been successfully processed`,
        link: `/payments/${data.paymentId}`
    }),

    // Vendor Notifications
    VENDOR_APPROVED: (data) => ({
        type: 'success',
        title: 'Vendor Registration Approved',
        message: `${data.vendorName} has been approved as a vendor`,
        link: `/vendors/${data.vendorId}`
    }),

    VENDOR_BLOCKED: (data) => ({
        type: 'warning',
        title: 'Vendor Blocked',
        message: `${data.vendorName} has been blocked. ${data.reason || ''}`,
        link: `/vendors/${data.vendorId}`
    }),

    // Inventory Notifications
    LOW_STOCK_ALERT: (data) => ({
        type: 'warning',
        title: 'Low Stock Alert ⚠️',
        message: `${data.componentName} is running low. Current: ${data.currentStock}, Min: ${data.minStock}`,
        link: `/component-details`
    }),

    COMPONENT_RECEIVED: (data) => ({
        type: 'success',
        title: 'Components Received',
        message: `${data.quantity} units of ${data.componentName} received`,
        link: `/component-details`
    }),

    // Warranty Claims
    WARRANTY_SUBMITTED: (data) => ({
        type: 'info',
        title: 'Warranty Claim Submitted',
        message: `Claim #${data.claimId} for ${data.componentName} has been submitted`,
        link: `/warranty-claims/${data.claimId}`
    }),

    WARRANTY_APPROVED: (data) => ({
        type: 'success',
        title: 'Warranty Claim Approved',
        message: `Your warranty claim #${data.claimId} has been approved`,
        link: `/warranty-claims/${data.claimId}`
    }),

    WARRANTY_REJECTED: (data) => ({
        type: 'error',
        title: 'Warranty Claim Rejected',
        message: `Claim #${data.claimId} rejected. ${data.reason || 'Please contact support.'}`,
        link: `/warranty-claims/${data.claimId}`
    }),

    // Request Notifications
    REQUEST_APPROVED: (data) => ({
        type: 'success',
        title: 'Request Approved',
        message: `Your ${data.requestType} request has been approved`,
        link: data.link
    }),

    REQUEST_REJECTED: (data) => ({
        type: 'error',
        title: 'Request Rejected',
        message: `Your ${data.requestType} request was rejected. ${data.reason || ''}`,
        link: data.link
    })
};

/**
 * Create and emit a notification
 * @param {String} recipient - User ID to send notification to
 * @param {String} template - Template name from notificationTemplates
 * @param {Object} data - Data to populate template
 * @param {Object} io - Socket.IO instance for real-time emission
 */
exports.createAutoNotification = async ({ recipient, template, data, io }) => {
    try {
        // Get notification content from template
        const notifData = notificationTemplates[template](data);

        // Create notification in database
        const notification = await Notification.create({
            recipient,
            ...notifData
        });

        // Emit real-time notification via WebSocket
        if (io) {
            io.emit('new-notification', notification);
            console.log(`📩 Real-time notification sent: ${template} to ${recipient}`);
        }

        return notification;
    } catch (error) {
        console.error('❌ Error creating auto-notification:', error);
        // Don't throw - notifications are non-critical
        return null;
    }
};

/**
 * Create notification without template (custom)
 */
exports.createCustomNotification = async ({ recipient, type, title, message, link, io }) => {
    try {
        const notification = await Notification.create({
            recipient,
            type,
            title,
            message,
            link
        });

        if (io) {
            io.emit('new-notification', notification);
        }

        return notification;
    } catch (error) {
        console.error('❌ Error creating custom notification:', error);
        return null;
    }
};

module.exports = exports;
