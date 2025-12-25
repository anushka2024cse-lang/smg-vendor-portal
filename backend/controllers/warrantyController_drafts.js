// Draft-specific endpoints at the end of warrantyController.js

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

module.exports = exports;
