const SOR = require('../models/SOR');

// @desc    Get all SORs with pagination and filters
// @route   GET /api/v1/sor
// @access  Public (add auth later)
exports.getAllSORs = async (req, res) => {
    try {
        const { status, vendor, page = 1, limit = 10 } = req.query;

        // Build filter
        const filter = {};
        if (status) filter.status = status;
        if (vendor) filter.vendor = new RegExp(vendor, 'i');

        // Pagination
        const skip = (page - 1) * limit;

        const sors = await SOR.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await SOR.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: sors.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: sors
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get single SOR by ID
// @route   GET /api/v1/sor/:id
// @access  Public
exports.getSOR = async (req, res) => {
    try {
        const sor = await SOR.findById(req.params.id);

        if (!sor) {
            return res.status(404).json({
                success: false,
                error: 'SOR not found'
            });
        }

        res.status(200).json({ success: true, data: sor });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Create new SOR
// @route   POST /api/v1/sor
// @access  Public (add auth later)
exports.createSOR = async (req, res) => {
    try {
        const sor = await SOR.create(req.body);

        res.status(201).json({
            success: true,
            message: 'SOR created successfully',
            data: sor
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'SOR Number already exists'
            });
        }
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update SOR
// @route   PUT /api/v1/sor/:id
// @access  Public
exports.updateSOR = async (req, res) => {
    try {
        const sor = await SOR.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!sor) {
            return res.status(404).json({
                success: false,
                error: 'SOR not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'SOR updated successfully',
            data: sor
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete SOR (soft delete by changing status)
// @route   DELETE /api/v1/sor/:id
// @access  Public
exports.deleteSOR = async (req, res) => {
    try {
        const sor = await SOR.findById(req.params.id);

        if (!sor) {
            return res.status(404).json({
                success: false,
                error: 'SOR not found'
            });
        }

        // Soft delete - just mark as inactive
        sor.status = 'Rejected';
        await sor.save();

        res.status(200).json({
            success: true,
            message: 'SOR deleted successfully',
            data: {}
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Submit SOR for review
// @route   POST /api/v1/sor/:id/submit
// @access  Public
exports.submitSOR = async (req, res) => {
    try {
        const sor = await SOR.findById(req.params.id);

        if (!sor) {
            return res.status(404).json({
                success: false,
                error: 'SOR not found'
            });
        }

        if (sor.status !== 'Draft' && sor.status !== 'Active') {
            return res.status(400).json({
                success: false,
                error: 'Only Draft or Active SORs can be submitted'
            });
        }

        sor.status = 'Pending Review';
        sor.submittedDate = new Date();
        await sor.save();

        // AUTO-NOTIFICATION: Notify approvers/admins
        const { createAutoNotification } = require('../utils/notificationHelper');
        await createAutoNotification({
            recipient: 'admin-user-id', // TODO: Get actual approver IDs
            template: 'SOR_SUBMITTED',
            data: {
                sorNumber: sor.sorNumber,
                sorId: sor._id,
                creatorName: req.user?.name || 'User'
            },
            io: req.app.get('io')
        });

        res.status(200).json({
            success: true,
            message: 'SOR submitted for review',
            data: sor
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Approve SOR
// @route   POST /api/v1/sor/:id/approve
// @access  Public (should be admin only)
exports.approveSOR = async (req, res) => {
    try {
        const sor = await SOR.findById(req.params.id);

        if (!sor) {
            return res.status(404).json({
                success: false,
                error: 'SOR not found'
            });
        }

        if (sor.status !== 'Pending Review') {
            return res.status(400).json({
                success: false,
                error: 'Only SORs pending review can be approved'
            });
        }

        sor.status = 'Approved';
        await sor.save();

        // AUTO-NOTIFICATION: Notify creator
        const { createAutoNotification } = require('../utils/notificationHelper');
        await createAutoNotification({
            recipient: sor.createdBy || 'temp-user-id',
            template: 'SOR_APPROVED',
            data: {
                sorNumber: sor.sorNumber,
                sorId: sor._id,
                approverName: req.user?.name || 'Admin'
            },
            io: req.app.get('io')
        });

        res.status(200).json({
            success: true,
            message: 'SOR approved successfully',
            data: sor
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get SOR history/revisions
// @route   GET /api/v1/sor/:id/history
// @access  Public
exports.getSORHistory = async (req, res) => {
    try {
        // TODO: Implement revision tracking in a separate collection
        // For now, return basic info
        const sor = await SOR.findById(req.params.id);

        if (!sor) {
            return res.status(404).json({
                success: false,
                error: 'SOR not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                currentRevision: sor.revision,
                createdAt: sor.createdAt,
                lastEditedDate: sor.lastEditedDate,
                submittedDate: sor.submittedDate
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
