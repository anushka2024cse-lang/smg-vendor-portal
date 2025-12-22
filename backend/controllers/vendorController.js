const Vendor = require('../models/Vendor');

// @desc    Get all vendors
// @route   GET /api/v1/vendors
// @access  Private
exports.getVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find();
        res.status(200).json(vendors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single vendor
// @route   GET /api/v1/vendors/:id
// @access  Private
exports.getVendor = async (req, res) => {
    try {
        // Search by internal vendorId (V-001) first, then Mongo ID
        let vendor = await Vendor.findOne({ vendorId: req.params.id });

        if (!vendor) {
            vendor = await Vendor.findById(req.params.id);
        }

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        res.status(200).json(vendor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new vendor
// @route   POST /api/v1/vendors
// @access  Private
exports.createVendor = async (req, res) => {
    try {
        const vendor = await Vendor.create(req.body);
        res.status(201).json(vendor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update vendor
// @route   PUT /api/v1/vendors/:id
// @access  Private
exports.updateVendor = async (req, res) => {
    try {
        let vendor = await Vendor.findOne({ vendorId: req.params.id });

        if (!vendor) {
            vendor = await Vendor.findById(req.params.id);
        }

        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        vendor = await Vendor.findByIdAndUpdate(vendor._id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json(vendor);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get vendor transactions (Mock for now, or link to POs)
// @route   GET /api/v1/vendors/:id/transactions
// @access  Private
exports.getVendorTransactions = async (req, res) => {
    res.status(200).json([]); // Placeholder for now
};
