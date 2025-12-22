const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    paymentNumber: {
        type: String,
        unique: true
        // Not required - auto-generated in pre-save hook
    },
    purchaseOrder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurchaseOrder'
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true,
        index: true
    },
    invoiceDate: {
        type: Date,
        required: true
    },
    invoiceAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentAmount: {
        type: Number,
        required: true,
        min: 0
    },
    tdsAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    otherDeductions: {
        type: Number,
        default: 0,
        min: 0
    },
    netPayableAmount: {
        type: Number,
        required: true
    },
    paymentType: {
        type: String,
        enum: ['advance', 'against-invoice', 'partial', 'final-settlement'],
        default: 'against-invoice'
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Approved', 'Paid', 'Rejected', 'On Hold', 'Cancelled'],
        default: 'Pending'
    },
    paymentMode: {
        type: String,
        enum: ['RTGS', 'NEFT', 'UPI', 'Cheque', 'Cash', 'Other', '-'],
        default: '-'
    },
    transactionReference: {
        type: String,
        default: '-'
    },
    paymentDate: Date,
    dueDate: Date,
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        bankName: String,
        branch: String
    },
    approvalHistory: [{
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        level: Number,
        status: String,
        comments: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    documents: [{
        name: String,
        url: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    remarks: {
        type: String,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Auto-generate payment number before saving
paymentSchema.pre('save', async function (next) {
    if (!this.paymentNumber) {
        const year = new Date().getFullYear();
        const count = await mongoose.model('Payment').countDocuments();
        this.paymentNumber = `PAY-${year}-${String(count + 1).padStart(3, '0')}`;
    }

    // Calculate net payable amount
    this.netPayableAmount = this.paymentAmount - this.tdsAmount - this.otherDeductions;

    next();
});

// Performance indexes
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ vendor: 1, status: 1 });
paymentSchema.index({ paymentNumber: 1 });
paymentSchema.index({ invoiceNumber: 1 });
paymentSchema.index({ paymentDate: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
