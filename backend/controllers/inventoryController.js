const Inventory = require('../models/Inventory');
const Transaction = require('../models/Transaction');

exports.getInventory = async (req, res) => {
    try {
        const inventory = await Inventory.find().sort({ updatedAt: -1 });
        res.status(200).json({ success: true, count: inventory.length, data: inventory });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.addInventoryItem = async (req, res) => {
    try {
        const item = await Inventory.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ message: 'SKU exists' });
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.receiveMaterial = async (req, res) => {
    const session = await Inventory.startSession();
    session.startTransaction();
    try {
        const { items, reference, notes } = req.body;
        const txItems = [];
        for (const entry of items) {
            const item = await Inventory.findById(entry.item);
            if (!item) throw new Error(`Item not found: ${entry.item}`);
            item.quantity += parseInt(entry.quantity);
            await item.save({ session });
            txItems.push({ item: item._id, name: item.name, sku: item.sku, quantity: entry.quantity });
        }
        await Transaction.create([{ type: 'RECEIPT', items: txItems, user: req.user.id, reference, notes }], { session });
        await session.commitTransaction();
        res.status(201).json({ success: true, message: 'Received' });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: error.message });
    } finally {
        session.endSession();
    }
};

exports.dispatchMaterial = async (req, res) => {
    const session = await Inventory.startSession();
    session.startTransaction();
    try {
        const { items, reference, notes } = req.body;
        const txItems = [];
        for (const entry of items) {
            const item = await Inventory.findById(entry.item);
            if (!item) throw new Error(`Item not found`);
            if (item.quantity < entry.quantity) throw new Error(`Insufficient stock: ${item.name}`);
            item.quantity -= parseInt(entry.quantity);
            await item.save({ session });
            txItems.push({ item: item._id, name: item.name, sku: item.sku, quantity: entry.quantity });
        }
        await Transaction.create([{ type: 'DISPATCH', items: txItems, user: req.user.id, reference, notes }], { session });
        await session.commitTransaction();
        res.status(201).json({ success: true, message: 'Dispatched' });
    } catch (error) {
        await session.abortTransaction();
        res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
};
