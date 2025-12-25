const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    vendorId: {
        type: String,
        unique: true
    },

    // Core Fields
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

    // Document Control
    documentControl: {
        code: String,
        revisionDate: Date,
        revisionStatus: String
    },

    // Extended Supplier Details
    companyPrefix: {
        type: String,
        enum: ['Company', 'Mr', 'Ms'],
        default: 'Company'
    },
    houseNo: String,
    nearestRailwayStation: String,
    nearestAirport: String,

    // Address
    address: {
        street: String,
        state: String,
        zip: String,
        country: { type: String, default: 'India' }
    },

    // Financial Details
    currency: {
        type: String,
        enum: ['INR', 'USD', 'EURO'],
        default: 'INR'
    },
    paymentTerms: String,

    // Extended Contact Details
    designation: String,
    faxNo: String,
    alternateEmailId: String,
    gstContact: {
        phone: String,
        email: String
    },

    // Bank Details
    bank: {
        name: String,
        account: String,
        ifsc: String
    },

    // Business Classification
    vendorStatus: [{
        type: String,
        enum: ['Proprietor', 'Ltd', 'Co', 'Partnership']
    }],
    industrialStatus: {
        type: String,
        enum: ['Micro', 'Small', 'Medium', 'Large', 'Not Applicable']
    },

    // Staff Details
    staff: {
        sales: Number,
        service: Number,
        others: Number,
        total: Number
    },

    // Products
    dealerProducts: String,
    productRange: String,

    // Tax & Compliance
    tax: {
        pan: String,
        gst: String,
        tan: String,
        gstVendorClass: {
            type: String,
            enum: ['Registered', 'Not Registered', 'Composition', 'Govt Org']
        }
    },

    // SMG Registration
    registeredWithSMG: {
        type: String,
        enum: ['Yes', 'No']
    },

    // Logistics
    materialSupplyMode: [{
        type: String,
        enum: ['By Road', 'Courier', 'Other']
    }],
    modeOfTransport: String,

    // CRITICAL: Document File Paths
    documents: {
        cancelledCheque: String,
        panDocument: String,
        gstDocument: String,
        tanDocument: String,
        signatureDocument: String
    },

    // Metadata for future extensions
    metadata: mongoose.Schema.Types.Mixed,

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-generate vendorId if not provided
VendorSchema.pre('save', function (next) {
    if (!this.vendorId) {
        this.vendorId = 'V-' + Math.floor(1000 + Math.random() * 9000);
    }
    next();
});

module.exports = mongoose.model('Vendor', VendorSchema);
