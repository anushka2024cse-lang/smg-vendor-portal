const express = require('express');
const router = express.Router();
const Component = require('../models/Component');
// const { protect } = require('../middleware/auth'); // Uncomment if auth needed later

// @desc    Get all components
// @route   GET /api/v1/components
// @access  Public (or Private)
router.get('/', async (req, res) => {
    try {
        const components = await Component.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: components.length, data: components });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @desc    Get single component
// @route   GET /api/v1/components/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const component = await Component.findById(req.params.id);
        if (!component) {
            return res.status(404).json({ success: false, error: 'Component not found' });
        }
        res.status(200).json({ success: true, data: component });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @desc    Create new component
// @route   POST /api/v1/components
// @access  Public
router.post('/', async (req, res) => {
    try {
        const component = await Component.create(req.body);
        res.status(201).json({ success: true, data: component });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'Component Code must be unique' });
        }
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Update component
// @route   PUT /api/v1/components/:id
// @access  Public
router.put('/:id', async (req, res) => {
    try {
        const component = await Component.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!component) {
            return res.status(404).json({ success: false, error: 'Component not found' });
        }

        res.status(200).json({ success: true, data: component });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Delete component
// @route   DELETE /api/v1/components/:id
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const component = await Component.findByIdAndDelete(req.params.id);

        if (!component) {
            return res.status(404).json({ success: false, error: 'Component not found' });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
