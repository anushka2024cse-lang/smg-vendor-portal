const mongoose = require('mongoose');

const PurchaseOrderSchema = new mongoose.Schema({
    poNumber: { type: String, required: true, unique: true },
    vendor: { type: String, required: true }, // Vendor Name
    vendorId: { type: String }, // Optional link to vendor ID
    date: { type: Date, required: true },
    expectedDeliveryDate: { type: Date },
    status: {
        type: String,
        enum: ['Draft', 'Issued', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Draft'
    },
    paymentTerms: { type: String },
    deliveryAddress: { type: String },
    termsAndConditions: { type: String },
    remarks: { type: String },
    items: [{
        componentCode: { type: String, required: true },
        componentName: { type: String, required: true },
        qty: { type: Number, required: true },
        unit: { type: String, default: 'pcs' },
        unitPrice: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true }
    }],
    subtotal: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('PurchaseOrder', PurchaseOrderSchema);
