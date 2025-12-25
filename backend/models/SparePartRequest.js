const mongoose = require('mongoose');

const SparePartRequestSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        unique: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: false // Allowing null for manual entry flexibility initially
    },
    vendorName: { // Fallback if vendor ID is not available
        type: String
    },
    component: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    reason: {
        type: String
    },
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SparePartRequest', SparePartRequestSchema);
