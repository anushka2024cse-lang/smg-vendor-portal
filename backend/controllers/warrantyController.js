const Warranty = require('../models/Warranty');

// @desc    Get all warranty claims
// @route   GET /api/v1/warranty
// @access  Public
exports.getAllClaims = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (status && status !== 'All') filter.status = status;

        const skip = (page - 1) * limit;

        const claims = await Warranty.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Warranty.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: claims.length,
            total,
            data: claims
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get single warranty claim
// @route   GET /api/v1/warranty/:id
// @access  Public
exports.getClaim = async (req, res) => {
    try {
        const claim = await Warranty.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({
                success: false,
                error: 'Warranty claim not found'
            });
        }

        res.status(200).json({
            success: true,
            data: claim
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Create warranty claim
// @route   POST /api/v1/warranty
// @access  Public
exports.createClaim = async (req, res) => {
    console.log('\n=== WARRANTY CLAIM CREATE CALLED ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Body field count:', Object.keys(req.body).length);

    try {
        console.log('Attempting to create warranty claim...');
        const claim = await Warranty.create(req.body);
        console.log('✅ Claim created successfully!');
        console.log('Claim ID:', claim._id);
        console.log('Claim Number:', claim.claimNumber);
        console.log('Work Order:', claim.workOrderNumber);
        console.log('Defect Code:', claim.defectCode);
        console.log('Full claim:', JSON.stringify(claim, null, 2));

        res.status(201).json({
            success: true,
            message: 'Warranty claim submitted successfully',
            data: claim
        });
        console.log('✅ Response sent to client');
        console.log('=== END WARRANTY CLAIM CREATE ===\n');
    } catch (err) {
        console.log('❌ ERROR creating warranty claim:');
        console.log('Error name:', err.name);
        console.log('Error message:', err.message);
        console.log('Error stack:', err.stack);
        if (err.errors) {
            console.log('Validation errors:', JSON.stringify(err.errors, null, 2));
        }
        console.log('=== END WARRANTY CLAIM CREATE (ERROR) ===\n');

        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update warranty claim
// @route   PATCH /api/v1/warranty/:id
// @access  Public
exports.updateClaim = async (req, res) => {
    try {
        const claim = await Warranty.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!claim) {
            return res.status(404).json({
                success: false,
                error: 'Warranty claim not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Warranty claim updated successfully',
            data: claim
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Approve warranty claim
// @route   PUT /api/v1/warranty/:id/approve
// @access  Private (Admin)
exports.approveClaim = async (req, res) => {
    try {
        // TODO: Update warranty claim status
        const claim = {
            _id: req.params.id,
            status: 'Approved',
            claimNumber: 'WC-2024-001'
        };

        // AUTO-NOTIFICATION: Notify customer
        const { createAutoNotification } = require('../utils/notificationHelper');
        await createAutoNotification({
            recipient: req.body.customerId || 'customer-id',
            template: 'WARRANTY_APPROVED',
            data: {
                claimId: claim._id
            },
            io: req.app.get('io')
        });

        res.status(200).json({
            success: true,
            message: 'Warranty claim approved',
            data: claim
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Reject warranty claim
// @route   PUT /api/v1/warranty/:id/reject
// @access  Private (Admin)
exports.rejectClaim = async (req, res) => {
    try {
        // TODO: Update warranty claim status
        const claim = {
            _id: req.params.id,
            status: 'Rejected',
            claimNumber: 'WC-2024-001'
        };

        // AUTO-NOTIFICATION: Notify customer
        const { createAutoNotification } = require('../utils/notificationHelper');
        await createAutoNotification({
            recipient: req.body.customerId || 'customer-id',
            template: 'WARRANTY_REJECTED',
            data: {
                claimId: claim._id,
                reason: req.body.reason || 'Claim does not meet warranty criteria'
            },
            io: req.app.get('io')
        });

        res.status(200).json({
            success: true,
            message: 'Warranty claim rejected',
            data: claim
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Save warranty claim as draft
// @route   POST /api/v1/warranty/draft
// @access  Public
exports.saveDraft = async (req, res) => {
    try {
        const draftData = {
            ...req.body,
            isDraft: true,
            status: 'Draft',
            draftSavedAt: new Date()
        };

        const draft = await Warranty.create(draftData);

        res.status(201).json({
            success: true,
            message: 'Draft saved successfully',
            data: draft
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get all drafts
// @route   GET /api/v1/warranty/drafts
// @access  Public
exports.getDrafts = async (req, res) => {
    try {
        const drafts = await Warranty.find({ isDraft: true })
            .sort({ draftSavedAt: -1 });

        res.status(200).json({
            success: true,
            count: drafts.length,
            data: drafts
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Publish draft as claim
// @route   PUT /api/v1/warranty/:id/publish
// @access  Public
exports.publishDraft = async (req, res) => {
    try {
        const draft = await Warranty.findById(req.params.id);

        if (!draft) {
            return res.status(404).json({
                success: false,
                error: 'Draft not found'
            });
        }

        if (!draft.isDraft) {
            return res.status(400).json({
                success: false,
                error: 'This is not a draft'
            });
        }

        // Update to published claim
        draft.isDraft = false;
        draft.status = 'Pending';
        draft.submittedDate = new Date();

        await draft.save();

        res.status(200).json({
            success: true,
            message: 'Draft published successfully',
            data: draft
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete warranty claim
// @route   DELETE /api/v1/warranty/:id
// @access  Public
exports.deleteClaim = async (req, res) => {
    try {
        const claim = await Warranty.findById(req.params.id);

        if (!claim) {
            return res.status(404).json({
                success: false,
                error: 'Warranty claim not found'
            });
        }

        await claim.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Warranty claim deleted successfully',
            data: {}
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

module.exports = exports;
