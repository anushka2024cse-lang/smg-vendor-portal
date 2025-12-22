const Inventory = require('../models/Inventory');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Get Dashboard Metrics
// @route   GET /api/v1/dashboard
// @access  Private
exports.getDashboardMetrics = async (req, res) => {
    try {
        const totalStock = await Inventory.aggregate([
            { $group: { _id: null, total: { $sum: "$quantity" } } }
        ]);

        const totalValue = await Inventory.aggregate([
            { $group: { _id: null, total: { $sum: { $multiply: ["$quantity", "$valuePerUnit"] } } } }
        ]);

        const lowStockCount = await Inventory.countDocuments({ $expr: { $lt: ["$quantity", "$minLevel"] } });

        const recentTransactions = await Transaction.find()
            .sort({ date: -1 })
            .limit(5)
            .populate('user', 'name');

        res.status(200).json({
            success: true,
            data: {
                totalStock: totalStock[0]?.total || 0,
                totalValue: totalValue[0]?.total || 0,
                lowStockItems: lowStockCount,
                recentActivity: recentTransactions
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
