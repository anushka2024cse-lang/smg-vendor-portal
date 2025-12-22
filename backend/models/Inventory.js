const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add an item name']
    },
    sku: {
        type: String,
        required: [true, 'Please add a SKU'],
        unique: true
    },
    category: {
        type: String,
        required: true,
        default: 'General'
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    unit: {
        type: String, // e.g., kg, pcs, boxes
        default: 'pcs'
    },
    location: {
        type: String,
        required: true
    },
    minLevel: {
        type: Number,
        default: 10
    },
    valuePerUnit: {
        type: Number,
        default: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Inventory', InventorySchema);
