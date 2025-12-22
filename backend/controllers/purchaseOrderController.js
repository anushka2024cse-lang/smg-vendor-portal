const PurchaseOrder = require('../models/PurchaseOrder');

// Create a new PO
exports.createPurchaseOrder = async (req, res) => {
    try {
        const newPO = new PurchaseOrder(req.body);
        const savedPO = await newPO.save();
        res.status(201).json(savedPO);
    } catch (error) {
        res.status(500).json({ message: 'Error creating purchase order', error: error.message });
    }
};

// Get all POs
exports.getAllPurchaseOrders = async (req, res) => {
    try {
        const pos = await PurchaseOrder.find().sort({ createdAt: -1 });
        res.status(200).json(pos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching purchase orders', error: error.message });
    }
};

// Get PO by ID
exports.getPurchaseOrderById = async (req, res) => {
    try {
        const po = await PurchaseOrder.findById(req.params.id);
        if (!po) return res.status(404).json({ message: 'Purchase Order not found' });
        res.status(200).json(po);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching purchase order', error: error.message });
    }
};

// Update PO Status (or full update)
exports.updatePurchaseOrder = async (req, res) => {
    try {
        const updatedPO = await PurchaseOrder.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedPO) return res.status(404).json({ message: 'Purchase Order not found' });
        res.status(200).json(updatedPO);
    } catch (error) {
        res.status(500).json({ message: 'Error updating purchase order', error: error.message });
    }
};

// Delete PO
exports.deletePurchaseOrder = async (req, res) => {
    try {
        const deletedPO = await PurchaseOrder.findByIdAndDelete(req.params.id);
        if (!deletedPO) return res.status(404).json({ message: 'Purchase Order not found' });
        res.status(200).json({ message: 'Purchase Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting purchase order', error: error.message });
    }
};
