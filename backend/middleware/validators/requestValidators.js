const { body, validationResult } = require('express-validator');

// Validation middleware wrapper
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

// HSRP Request Validators
exports.validateHSRPRequest = [
    body('vehicleNumber')
        .trim()
        .notEmpty().withMessage('Vehicle number is required')
        .matches(/^[A-Z]{2}[0-9]{2}[A-Z]{0,2}[0-9]{4}$/).withMessage('Invalid vehicle number format'),
    body('ownerName')
        .trim()
        .notEmpty().withMessage('Owner name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Owner name must be 2-100 characters'),
    body('requestType')
        .isIn(['New', 'Replacement', 'Duplicate']).withMessage('Invalid request type'),
    body('phone')
        .optional()
        .isMobilePhone('en-IN').withMessage('Invalid phone number'),
    body('chassisNumber')
        .optional()
        .isLength({ max: 50 }),
    validate
];

// RSA Request Validators
exports.validateRSARequest = [
    body('vehicleNumber')
        .trim()
        .notEmpty().withMessage('Vehicle number is required'),
    body('customerName')
        .trim()
        .notEmpty().withMessage('Customer name is required')
        .isLength({ min: 2, max: 100 }),
    body('customerPhone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .isMobilePhone('en-IN').withMessage('Invalid phone number'),
    body('issueDescription')
        .trim()
        .notEmpty().withMessage('Issue description is required')
        .isLength({ min: 10, max: 500 }).withMessage('Description must be 10-500 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required'),
    body('requestType')
        .optional()
        .isIn(['Breakdown', 'Accident', 'Towing', 'Battery', 'Tire', 'Other']),
    validate
];

// Spare Part Request Validators
exports.validateSparePartRequest = [
    body('partName')
        .trim()
        .notEmpty().withMessage('Part name is required')
        .isLength({ min: 2, max: 200 }),
    body('partNumber')
        .optional()
        .trim()
        .isLength({ max: 50 }),
    body('quantity')
        .isInt({ min: 1, max: 10000 }).withMessage('Quantity must be between 1 and 10000'),
    body('vehicleModel')
        .optional()
        .trim()
        .isLength({ max: 100 }),
    body('urgency')
        .optional()
        .isIn(['Low', 'Medium', 'High', 'Critical']),
    body('requestedBy')
        .optional()
        .trim()
        .isLength({ max: 100 }),
    validate
];

// Die Plan Validators
exports.validateDiePlan = [
    body('planName')
        .trim()
        .notEmpty().withMessage('Plan name is required')
        .isLength({ min: 3, max: 200 }),
    body('dieNumber')
        .optional()
        .trim()
        .isLength({ max: 50 }),
    body('component')
        .trim()
        .notEmpty().withMessage('Component is required'),
    body('quantity')
        .optional()
        .isInt({ min: 1 }),
    body('startDate')
        .optional()
        .isISO8601().withMessage('Invalid start date format'),
    body('endDate')
        .optional()
        .isISO8601().withMessage('Invalid end date format'),
    body('status')
        .optional()
        .isIn(['Planned', 'In Progress', 'Completed', 'On Hold', 'Cancelled']),
    validate
];

// File Upload Validators
exports.validateFileUpload = (req, res, next) => {
    if (!req.file && !req.files) {
        return res.status(400).json({
            success: false,
            message: 'No file uploaded'
        });
    }

    const file = req.file || req.files[0];

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
            success: false,
            message: 'File size exceeds 5MB limit'
        });
    }

    // Check file type
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid file type. Allowed: PDF, JPG, PNG, DOC, DOCX'
        });
    }

    next();
};

// Admin Operation Validators
exports.validateAdminOperation = [
    body('action')
        .isIn(['approve', 'reject', 'delete', 'update']).withMessage('Invalid action'),
    body('reason')
        .if(body('action').equals('reject'))
        .notEmpty().withMessage('Reason is required for rejection'),
    validate
];

module.exports = exports;
