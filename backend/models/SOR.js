const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
    specification: {
        type: String,
        trim: true
    },
    customerRequirement: {
        type: String,
        trim: true
    },
    compliance: {
        type: String,
        enum: ['Yes', 'No', 'Partial'],
        default: 'Yes'
    },
    remarks: {
        type: String,
        trim: true
    }
}, { _id: true });

const sorSchema = new mongoose.Schema({
    sorNumber: {
        type: String,
        required: false,  // Auto-generated in pre-save hook
        unique: true,
        trim: true,
        uppercase: true
    },
    vendor: {
        type: String,
        required: [true, 'Vendor is required'],
        trim: true
    },
    documentNumber: {
        type: String,
        trim: true,
        default: 'LBD-MKTGSOR-PC'
    },
    companyDetails: {
        companyName: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true
        },
        enquirerName: {
            type: String,
            trim: true
        },
        contactInfo: {
            type: String,
            trim: true
        },
        natureOfCompany: {
            type: String,
            trim: true
        },
        keyAccountManager: {
            type: String,
            trim: true
        },
        technicalEngineer: {
            type: String,
            trim: true
        }
    },
    applicationDetails: {
        vehicleType: {
            type: String,
            enum: ['2W', '3W', '4W'],
            default: '2W'
        },
        chargerRatingV: {
            type: Number,
            default: 0
        },
        chargerRatingW: {
            type: Number,
            default: 0
        }
    },
    specifications: [specificationSchema],
    status: {
        type: String,
        enum: ['Draft', 'Active', 'Pending Review', 'Approved', 'Rejected'],
        default: 'Draft'
    },
    revision: {
        type: Number,
        default: 1
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    submittedDate: {
        type: Date
    },
    lastEditedDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Auto-generate SOR Number before saving
sorSchema.pre('save', async function (next) {
    if (this.isNew && !this.sorNumber) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');

        // Find the last SOR number for this month
        const lastSOR = await this.constructor.findOne({
            sorNumber: new RegExp(`^SOR-${year}${month}-`)
        }).sort({ sorNumber: -1 });

        let sequence = 1;
        if (lastSOR) {
            const lastSequence = parseInt(lastSOR.sorNumber.split('-')[2]);
            sequence = lastSequence + 1;
        }

        this.sorNumber = `SOR-${year}${month}-${String(sequence).padStart(3, '0')}`;
    }
    next();
});

// Update lastEditedDate on update
sorSchema.pre('findOneAndUpdate', function (next) {
    this.set({ lastEditedDate: new Date() });
    next();
});

// Indexes for performance
sorSchema.index({ status: 1 }); // Filter by status
sorSchema.index({ createdBy: 1 }); // User's SORs
// sorNumber already has unique:true, no need for additional index
sorSchema.index({ status: 1, createdAt: -1 }); // Status + date
sorSchema.index({ vendor: 1 }); // Filter by vendor

module.exports = mongoose.model('SOR', sorSchema);
