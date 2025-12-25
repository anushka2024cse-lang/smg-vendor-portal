const Certificate = require('../models/Certificate');
const logger = require('../config/logger');

// @desc    Get all certificates
// @route   GET /api/v1/certificates
// @access  Private
exports.getCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find().populate('vendor', 'name').sort({ createdAt: -1 });
        res.status(200).json(certificates);
    } catch (error) {
        logger.error('Error fetching certificates:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single certificate
// @route   GET /api/v1/certificates/:id
// @access  Private
exports.getCertificateById = async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id).populate('vendor', 'name email phone');

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        res.status(200).json(certificate);
    } catch (error) {
        logger.error('Error fetching certificate:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new certificate
// @route   POST /api/v1/certificates
// @access  Private (Admin/VendorManager)
exports.createCertificate = async (req, res) => {
    try {
        // Add creator to certificate data
        req.body.createdBy = req.user.id;

        const certificate = await Certificate.create(req.body);

        // Populate vendor info
        await certificate.populate('vendor', 'name');

        logger.info(`Certificate created: ${certificate.certificateNumber} by user ${req.user.id}`);

        res.status(201).json(certificate);
    } catch (error) {
        logger.error('Error creating certificate:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update certificate
// @route   PUT /api/v1/certificates/:id
// @access  Private (Admin/VendorManager)
exports.updateCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('vendor', 'name');

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        logger.info(`Certificate updated: ${certificate.certificateNumber}`);

        res.status(200).json(certificate);
    } catch (error) {
        logger.error('Error updating certificate:', error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete certificate
// @route   DELETE /api/v1/certificates/:id
// @access  Private (Admin only)
exports.deleteCertificate = async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndDelete(req.params.id);

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }

        logger.info(`Certificate deleted: ${certificate.certificateNumber}`);

        res.status(200).json({ message: 'Certificate deleted successfully' });
    } catch (error) {
        logger.error('Error deleting certificate:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get certificate statistics
// @route   GET /api/v1/certificates/stats
// @access  Private
exports.getCertificateStats = async (req, res) => {
    try {
        const today = new Date();
        const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));

        const stats = {
            total: await Certificate.countDocuments(),
            valid: await Certificate.countDocuments({ expiryDate: { $gt: thirtyDaysFromNow } }),
            expiringSoon: await Certificate.countDocuments({
                expiryDate: { $gte: today, $lte: thirtyDaysFromNow }
            }),
            expired: await Certificate.countDocuments({ expiryDate: { $lt: today } }),
            byType: await Certificate.aggregate([
                { $group: { _id: '$type', count: { $sum: 1 } } }
            ])
        };

        res.status(200).json(stats);
    } catch (error) {
        logger.error('Error fetching certificate stats:', error);
        res.status(500).json({ message: error.message });
    }
};
