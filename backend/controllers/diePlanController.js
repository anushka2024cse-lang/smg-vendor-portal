const DiePlan = require('../models/DiePlan');
const Vendor = require('../models/Vendor');

exports.getAllPlans = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const total = await DiePlan.countDocuments();
        const plans = await DiePlan.find()
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            data: plans,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createPlan = async (req, res) => {
    try {
        let vendorId = null;
        if (req.body.vendor) {
            const vendor = await Vendor.findOne({ name: req.body.vendor });
            if (vendor) vendorId = vendor._id;
        }

        const newPlan = new DiePlan({
            planId: `DP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            vendor: vendorId,
            vendorName: req.body.vendor,
            partName: req.body.partName,
            stage: req.body.stage,
            startDate: req.body.startDate,
            targetDate: req.body.targetDate,
            progress: req.body.stage === 'Design' ? 10 : req.body.stage === 'Production' ? 100 : 50
        });

        const savedPlan = await newPlan.save();
        res.status(201).json(savedPlan);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        // Can update status, stage, progress
        const updatedPlan = await DiePlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedPlan);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const total = await DiePlan.countDocuments();
        const inDevelopment = await DiePlan.countDocuments({ status: 'On Track' });
        const completed = await DiePlan.countDocuments({ status: 'Completed' });
        const delayed = await DiePlan.countDocuments({ status: 'Delayed' });
        res.status(200).json({ total, inDevelopment, completed, delayed });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single plan
exports.getPlan = async (req, res) => {
    try {
        const plan = await DiePlan.findById(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.json(plan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update plan
exports.updatePlan = async (req, res) => {
    try {
        const plan = await DiePlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.json(plan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete plan
exports.deletePlan = async (req, res) => {
    try {
        const plan = await DiePlan.findByIdAndDelete(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: 'Plan not found' });
        }
        res.json({ message: 'Plan deleted successfully', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
