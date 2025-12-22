const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: String, // Changed to String for testing (will be ObjectId with auth)
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'success', 'warning', 'error', 'sor', 'payment', 'po', 'vendor'],
        default: 'info'
    },
    title: {
        type: String,
        required: [true, 'Notification title is required'],
        trim: true
    },
    message: {
        type: String,
        required: [true, 'Notification message is required'],
        trim: true
    },
    link: {
        type: String,
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
