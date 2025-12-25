const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'vendors');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created uploads directory:', uploadDir);
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Parse vendorData to get supplier name
        let sanitizedName = 'vendor';
        try {
            if (req.body.vendorData) {
                const data = JSON.parse(req.body.vendorData);
                const supplierName = data.name || data.supplierName || 'vendor';
                sanitizedName = supplierName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            }
        } catch (e) {
            console.log('Could not parse vendorData for filename');
        }

        // Generate unique filename: vendorname_fieldname_timestamp.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${sanitizedName}_${file.fieldname}_${uniqueSuffix}${ext}`);
    }
});

// File filter - accept only PDF, JPG, JPEG, PNG
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed!'));
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
});

// Export upload middleware for vendor documents (5 optional file fields)
module.exports = upload.fields([
    { name: 'cancelledCheque', maxCount: 1 },
    { name: 'panDocument', maxCount: 1 },
    { name: 'gstDocument', maxCount: 1 },
    { name: 'tanDocument', maxCount: 1 },
    { name: 'signatureDocument', maxCount: 1 }
]);
