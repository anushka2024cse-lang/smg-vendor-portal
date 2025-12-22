const mongoose = require('mongoose');

const componentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a component name'],
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Please provide a component code'],
        unique: true,
        trim: true,
        uppercase: true
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['body_parts', 'electrical', 'motor', 'battery', 'controller', 'other', 'chassis', 'suspension', 'brakes'],
        default: 'other'
    },
    unitPrice: {
        type: Number,
        default: 0
    },
    unit: {
        type: String,
        default: 'pcs'
    },
    hsnCode: {
        type: String,
        trim: true
    },
    gstRate: {
        type: Number,
        default: 18
    },
    leadTime: {
        type: Number,
        default: 0
    },
    moq: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Discontinued'],
        default: 'Active'
    },
    description: {
        type: String
    },
    specifications: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Component', componentSchema);
