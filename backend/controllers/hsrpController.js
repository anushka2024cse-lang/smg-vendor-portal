const HSRPRequest = require('../models/HSRPRequest');
const Vendor = require('../models/Vendor');

exports.getAllRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const total = await HSRPRequest.countDocuments();
        const requests = await HSRPRequest.find()
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

exports.createRequest = async (req, res) => {
    try {
        let vendorId = null;
        if (req.body.vendor) {
            const vendor = await Vendor.findOne({ name: req.body.vendor });
            if (vendor) vendorId = vendor._id;
        }

        const newRequest = new HSRPRequest({
            requestId: `HSRP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
            vendor: vendorId,
            vendorName: req.body.vendor,
            vehicleModel: req.body.model, // Frontend sends 'model', backend expects 'vehicleModel'
            regNumber: req.body.regNumber,
            chassisNumber: req.body.chassis,
            engineNumber: req.body.engine
        });

        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const updatedRequest = await HSRPRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.status(200).json(updatedRequest);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const total = await HSRPRequest.countDocuments();
        const pending = await HSRPRequest.countDocuments({ status: 'Pending' });
        const dispatched = await HSRPRequest.countDocuments({ status: 'Dispatched' });
        res.status(200).json({ total, pending, dispatched });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get single request
exports.getRequest = async (req, res) => {
    try {
        const request = await HSRPRequest.findById(req.params.id);
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
        const request = await HSRPRequest.findByIdAndUpdate(
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
        const request = await HSRPRequest.findByIdAndDelete(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        res.json({ message: 'Request deleted successfully', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
