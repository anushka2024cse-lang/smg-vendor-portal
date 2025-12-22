const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['RECEIPT', 'DISPATCH', 'ADJUSTMENT'],
        required: true
    },
    items: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Inventory',
                required: true
            },
            name: String, // Cache name in case item is deleted
            sku: String,
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reference: {
        type: String, // PO Number, Job Card, etc.
        default: ''
    },
    notes: String,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
