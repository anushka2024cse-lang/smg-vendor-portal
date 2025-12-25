const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    purchaseOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PurchaseOrder'
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    items: [{
        component: {
            type: String,
            required: true
        },
        description: String,
        quantity: {
            type: Number,
            required: true
        },
        unitPrice: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        }
    }],
    orderDate: {
        type: Date,
        default: Date.now
    },
    expectedDeliveryDate: Date,
    actualDeliveryDate: Date,
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'in-transit', 'delivered', 'cancelled', 'returned'],
        default: 'pending'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'partial', 'paid', 'overdue'],
        default: 'unpaid'
    },
    paymentDueDate: Date,
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },
    notes: String,
    trackingNumber: String,
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

// Auto-generate order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `ORD${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

// Index for faster queries
orderSchema.index({ status: 1, orderDate: -1 });
orderSchema.index({ vendor: 1, orderDate: -1 });
// orderNumber index already created by unique: true
orderSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
