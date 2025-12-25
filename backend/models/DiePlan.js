const mongoose = require('mongoose');

const DiePlanSchema = new mongoose.Schema({
    planId: {
        type: String,
        required: false,  // Auto-generated in controller
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
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual field: Calculate progress from stage dynamically
DiePlanSchema.virtual('progress').get(function () {
    const stageProgressMap = {
        'Design': 10,
        'Raw Material': 20,
        'Machining': 35,
        'Assembly': 50,
        'Trials T0': 65,
        'Trials T1': 80,
        'PPAP': 90,
        'Production': 100
    };
    return stageProgressMap[this.stage] || 10;
});

module.exports = mongoose.model('DiePlan', DiePlanSchema);
