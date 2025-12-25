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
        let vendorData = {};

        // Check if request has files (multipart/form-data)
        if (req.body.vendorData) {
            // Parse JSON vendorData from FormData
            vendorData = JSON.parse(req.body.vendorData);
        } else {
            // Regular JSON request
            vendorData = req.body;
        }

        // Add file paths if files were uploaded
        if (req.files) {
            vendorData.documents = {
                cancelledCheque: req.files.cancelledCheque?.[0]?.path,
                panDocument: req.files.panDocument?.[0]?.path,
                gstDocument: req.files.gstDocument?.[0]?.path,
                tanDocument: req.files.tanDocument?.[0]?.path,
                signatureDocument: req.files.signatureDocument?.[0]?.path
            };

            console.log('Files uploaded:', Object.keys(req.files));
        }

        const vendor = await Vendor.create(vendorData);
        res.status(201).json(vendor);
    } catch (error) {
        console.error('Create vendor error:', error);
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

// @desc    Get vendor transactions (Purchase Orders)
// @route   GET /api/v1/vendors/:id/transactions
// @access  Private
exports.getVendorTransactions = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ vendorId: req.params.id }) || await Vendor.findById(req.params.id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        const PurchaseOrder = require('../models/PurchaseOrder');
        const orders = await PurchaseOrder.find({ vendor: vendor._id }).sort({ date: -1 });

        // Map POs to the history format expected by frontend
        const history = orders.map(po => ({
            id: po._id,
            vendorId: vendor.vendorId,
            name: `PO: ${po.poNumber}`,
            date: new Date(po.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: po.status,
            type: 'Order' // New type, frontend handles generic types safely?
        }));

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get vendor documents (Certificates)
// @route   GET /api/v1/vendors/:id/documents
// @access  Private
exports.getVendorDocuments = async (req, res) => {
    try {
        const vendor = await Vendor.findOne({ vendorId: req.params.id }) || await Vendor.findById(req.params.id);
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });

        const Certificate = require('../models/Certificate');
        const certificates = await Certificate.find({ vendor: vendor._id });

        // Map Certificates to document format
        const documents = certificates.map(cert => ({
            id: cert._id,
            vendorId: vendor.vendorId,
            name: cert.certificateName,
            type: cert.type,
            status: new Date(cert.expiryDate) > new Date() ? 'Valid' : 'Expired',
            expiryDate: cert.expiryDate
        }));

        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
