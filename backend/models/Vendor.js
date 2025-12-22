const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    vendorId: {
        type: String,
        unique: true
        // We'll auto-generate this if not provided, or handle client-side
    },
    name: {
        type: String,
        required: [true, 'Please add a vendor name']
    },
    type: {
        type: String,
        default: 'Pvt Ltd'
    },
    city: String,
    status: {
        type: String,
        enum: ['Active', 'Pending', 'Blocked'],
        default: 'Pending'
    },
    contact: {
        type: String,
        required: [true, 'Please add a contact person']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    address: {
        street: String,
        state: String,
        zip: String,
        country: { type: String, default: 'India' }
    },
    tax: {
        pan: String,
        gst: String
    },
    bank: {
        name: String,
        account: String,
        ifsc: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-generate helper if needed, but for now we trust the input or post-middleware
VendorSchema.pre('save', function (next) {
    if (!this.vendorId) {
        // Simple ID generation logic
        this.vendorId = 'V-' + Math.floor(1000 + Math.random() * 9000);
    }
    next();
});

module.exports = mongoose.model('Vendor', VendorSchema);
