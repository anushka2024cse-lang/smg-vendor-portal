const { body, param, validationResult } = require('express-validator');

// Validation middleware to check for errors
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// SOR Validators
exports.createSORValidator = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),

    body('category')
        .optional()
        .isIn(['Electronics', 'Accessories', 'Components', 'Tools', 'Other'])
        .withMessage('Invalid category'),

    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Invalid priority'),

    validate
];

exports.updateSORValidator = [
    param('id').isMongoId().withMessage('Invalid SOR ID'),
    body('title').optional().trim().isLength({ min: 3, max: 200 }),
    body('description').optional().trim().isLength({ min: 10 }),
    body('category').optional().isIn(['Electronics', 'Accessories', 'Components', 'Tools', 'Other']),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
    validate
];

exports.sorIdValidator = [
    param('id').isMongoId().withMessage('Invalid SOR ID'),
    validate
];

// Notification Validators
exports.createNotificationValidator = [
    body('recipient')
        .trim()
        .notEmpty().withMessage('Recipient is required'),

    body('type')
        .isIn(['info', 'success', 'warning', 'error', 'sor', 'payment', 'po', 'vendor'])
        .withMessage('Invalid notification type'),

    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title too long'),

    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ max: 500 }).withMessage('Message too long'),

    body('link')
        .optional()
        .isURL({ require_protocol: false }).withMessage('Invalid URL format'),

    validate
];

exports.notificationIdValidator = [
    param('id').isMongoId().withMessage('Invalid notification ID'),
    validate
];

// Warranty Claim Validators
exports.createWarrantyClaimValidator = [
    body('claimType')
        .isIn(['Component Failure', 'Manufacturing Defect', 'Premature Wear', 'Other'])
        .withMessage('Invalid claim type'),

    body('componentName')
        .trim()
        .notEmpty().withMessage('Component name is required'),

    body('chassisNumber')
        .optional()
        .trim()
        .isLength({ min: 5, max: 50 }).withMessage('Invalid chassis number'),

    body('customerName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Invalid customer name'),

    body('customerEmail')
        .optional()
        .isEmail().withMessage('Invalid email format'),

    body('customerPhone')
        .optional()
        .isMobilePhone().withMessage('Invalid phone number'),

    validate
];

exports.warrantyIdValidator = [
    param('id').isMongoId().withMessage('Invalid warranty claim ID'),
    validate
];

// Purchase Order Validators
exports.createPOValidator = [
    body('vendorId')
        .isMongoId().withMessage('Invalid vendor ID'),

    body('items')
        .isArray({ min: 1 }).withMessage('At least one item required'),

    body('items.*.name')
        .trim()
        .notEmpty().withMessage('Item name required'),

    body('items.*.quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),

    body('items.*.unitPrice')
        .isFloat({ min: 0 }).withMessage('Unit price must be positive'),

    body('paymentTerms')
        .optional()
        .isIn(['Net 30', 'Net 60', 'Advance', 'COD'])
        .withMessage('Invalid payment terms'),

    validate
];

// Auth Validators
exports.loginValidator = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    validate
];

exports.registerValidator = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain uppercase, lowercase, and number'),

    body('role')
        .optional()
        .isIn(['user', 'admin', 'vendorManager', 'superAdmin'])
        .withMessage('Invalid role'),

    validate
];

exports.updateProfileValidator = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),

    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),

    body('phone')
        .optional()
        .isMobilePhone().withMessage('Invalid phone number'),

    body('department')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Department name too long'),

    body('designation')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Designation too long'),

    validate
];

module.exports = exports;
