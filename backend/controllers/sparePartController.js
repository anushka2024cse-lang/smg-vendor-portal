const SparePartRequest = require('../models/SparePartRequest');
const Vendor = require('../models/Vendor');

// Get all requests
exports.getAllRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const total = await SparePartRequest.countDocuments();
        const requests = await SparePartRequest.find()
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            data: requests,
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

// Get single request
exports.getRequest = async (req, res) => {
    try {
        const request = await SparePartRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update request
exports.updateRequest = async (req, res) => {
    try {
        const request = await SparePartRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json(request);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete request
exports.deleteRequest = async (req, res) => {
    try {
        const request = await SparePartRequest.findByIdAndDelete(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json({ message: 'Request deleted successfully', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new request
exports.createRequest = async (req, res) => {
    try {
        // Find existing vendor if name matches to link it
        let vendorId = null;
        if (req.body.vendor) {
            const vendor = await Vendor.findOne({ name: req.body.vendor });
            if (vendor) vendorId = vendor._id;
        }

        const newRequest = new SparePartRequest({
            requestId: `SPR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            vendor: vendorId,
            vendorName: req.body.vendor,
            component: req.body.component,
            quantity: req.body.quantity,
            priority: req.body.priority,
            reason: req.body.reason,
            dueDate: req.body.dueDate
        });

        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update status
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedRequest = await SparePartRequest.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        res.status(200).json(updatedRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Stats
exports.getStats = async (req, res) => {
    try {
        const total = await SparePartRequest.countDocuments();
        const pending = await SparePartRequest.countDocuments({ status: 'Pending' });
        const approved = await SparePartRequest.countDocuments({ status: 'Approved' });
        const rejected = await SparePartRequest.countDocuments({ status: 'Rejected' });

        res.status(200).json({ total, pending, approved, rejected });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
