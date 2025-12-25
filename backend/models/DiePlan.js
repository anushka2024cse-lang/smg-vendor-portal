const mongoose = require('mongoose');

const DiePlanSchema = new mongoose.Schema({
    planId: {
        type: String,
        required: true,
        unique: true
    },
    partName: {
        type: String,
        required: true
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: false
    },
    vendorName: {
        type: String
    },
    stage: {
        type: String,
        enum: ['Design', 'Raw Material', 'Machining', 'Assembly', 'Trials T0', 'Trials T1', 'PPAP', 'Production'],
        default: 'Design'
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    startDate: {
        type: Date
    },
    targetDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['On Track', 'Delayed', 'Completed'],
        default: 'On Track'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DiePlan', DiePlanSchema);
