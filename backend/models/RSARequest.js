const mongoose = require('mongoose');

const RSARequestSchema = new mongoose.Schema({
    requestId: {
        type: String,
        required: true,
        unique: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: false
    },
    vendorName: {
        type: String
    },
    vehicleNumber: {
        type: String,
        required: true
    },
    driverContact: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    issueType: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Resolved', 'Cancelled'],
        default: 'Active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('RSARequest', RSARequestSchema);
