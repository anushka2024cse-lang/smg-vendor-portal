const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema({
    claimNumber: {
        type: String,
        required: true,
        unique: true
    },
    claimType: {
        type: String,
        enum: ['Component Failure', 'Manufacturing Defect', 'Premature Wear', 'Other'],
        default: 'Component Failure'
    },
    workOrderNumber: String,
    defectCode: String,

    // Vehicle Information
    vehicleModel: String,
    chassisNumber: String,
    engineNumber: String,
    registrationNumber: String,
    manufacturingDate: Date,
    purchaseDate: Date,
    currentMileage: Number,

    // Component Details
    componentName: {
        type: String,
        required: true
    },
    partNumber: String,
    serialNumber: String,
    failureDate: Date,
    failureType: String,
    failureDescription: String,

    // Customer Information
    customerName: String,
    customerPhone: String,
    customerEmail: String,
    customerAddress: String,

    // Dealer Information
    dealerName: String,
    dealerCode: String,
    dealerLocation: String,
    serviceAdvisorName: String,
    serviceAdvisorPhone: String,

    // Cost Details
    laborHours: Number,
    laborCost: Number,
    partsCost: Number,
    totalClaimAmount: Number,

    // Status & Dates
    status: {
        type: String,
        enum: ['Pending', 'Under Review', 'Approved', 'Rejected', 'Pending Pickup'],
        default: 'Pending'
    },
    submittedDate: {
        type: Date,
        default: Date.now
    },
    reviewedDate: Date,
    approvedDate: Date,
    rejectedDate: Date,
    rejectionReason: String,

    // Pickup Details
    pickupScheduled: Date,
    pickupAddress: String,
    pickupInstructions: String,

    warrantyStatus: {
        type: String,
        enum: ['In Warranty', 'Out of Warranty', 'Extended Warranty'],
        default: 'In Warranty'
    },

    remarks: String,
    attachments: [String],

    createdBy: {
        type: String,
        default: 'system'
    }
}, {
    timestamps: true
});

// Auto-generate claim number if not provided
warrantySchema.pre('save', async function (next) {
    if (!this.claimNumber) {
        const count = await this.constructor.countDocuments();
        this.claimNumber = `WC-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Warranty', warrantySchema);
