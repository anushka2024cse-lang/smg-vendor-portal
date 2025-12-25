const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    certificateNumber: {
        type: String,
        unique: true
        // Auto-generated in pre-save hook
    },
    certificateName: {
        type: String,
        required: [true, 'Please add a certificate name']
    },
    type: {
        type: String,
        enum: ['Environmental', 'Quality', 'Safety', 'Compliance', 'Green Energy', 'Carbon Neutral', 'Other'],
        default: 'Environmental'
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    issuingAuthority: {
        type: String,
        required: [true, 'Please add an issuing authority']
    },
    complianceStandard: {
        type: String,
        default: ''
    },
    issueDate: {
        type: Date,
        required: [true, 'Please add an issue date']
    },
    expiryDate: {
        type: Date,
        required: [true, 'Please add an expiry date']
    },
    remarks: {
        type: String,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Auto-generate certificate number before saving
certificateSchema.pre('save', async function (next) {
    if (!this.certificateNumber) {
        const count = await mongoose.model('Certificate').countDocuments();
        this.certificateNumber = `CERT-${Date.now()}${count}`;
    }
    next();
});

// Indexes
// certificateNumber index already created by unique: true
certificateSchema.index({ vendor: 1 });
certificateSchema.index({ expiryDate: 1 });
certificateSchema.index({ type: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
