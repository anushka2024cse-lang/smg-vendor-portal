const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema({
    claimNumber: {
        type: String,
        unique: true
        // Not required - will be auto-generated in pre-save hook
    },
    claimType: {
        type: String,
        enum: ['Component Failure', 'Manufacturing Defect', 'Premature Wear', 'Other'],
        default: 'Component Failure'
    },
    workOrderNumber: String,
    defectCode: String,

    // Vehicle Information
    vehicleModel: String,
    chassisNumber: String,
    motorNumber: String,  // EV company - Motor instead of Engine
    batteryNumber: String,  // EV battery identification
    registrationNumber: String,
    manufacturingDate: Date,
    purchaseDate: Date,
    currentMileage: Number,

    // Component Details
    componentName: {
        type: String,
        required: true
    },
    partNumber: String,
    serialNumber: String,
    failureDate: Date,
    failureType: String,
    failureDescription: String,

    // Customer Information
    customerName: String,
    customerPhone: String,
    customerEmail: String,
    customerAddress: String,

    // Dealer Information
    dealerName: String,
    dealerCode: String,
    dealerLocation: String,
    serviceAdvisorName: String,
    serviceAdvisorPhone: String,

    // Cost Details
    laborHours: Number,
    laborCost: Number,
    partsCost: Number,
    totalClaimAmount: Number,

    // Status & Dates
    status: {
        type: String,
        enum: ['Draft', 'Pending', 'Under Review', 'Approved', 'Rejected', 'Pending Pickup'],
        default: 'Pending'
    },
    isDraft: {
        type: Boolean,
        default: false
    },
    draftSavedAt: Date,
    submittedDate: {
        type: Date,
        default: Date.now
    },
    reviewedDate: Date,
    approvedDate: Date,
    rejectedDate: Date,
    rejectionReason: String,

    // Pickup Details
    pickupScheduled: Date,
    pickupAddress: String,
    pickupInstructions: String,

    warrantyStatus: {
        type: String,
        enum: ['In Warranty', 'Out of Warranty', 'Extended Warranty'],
        default: 'In Warranty'
    },

    remarks: String,
    attachments: [String],

    // Component Technical Details
    technicalDetails: {
        // Charger Complaint (Lithium)
        chargerLithium: {
            chargerNo: String,
            batteryVoltage: Number,
            greenLedStatus: String,
            redLedPhylinStatus: String,
            mainsOnLedStatus: String,
            opOnLedStatus: String,
            batteryChargingLedStatus: String,
            fanStatus: String,
            chargingTime: String
        },

        // Charger Complaint (Lead Acid)
        chargerLeadAcid: {
            chargerNo: String,
            batteryVoltage: Number,
            greenLedStatus: String,
            redLedStatus: String,
            blueLedStatus: String,
            fanStatus: String,
            chargingTime: String
        },

        // Battery Complaint (Lithium)
        batteryLithium: {
            batteryNo: String,
            vehicleCurrent: String,
            condition: String,
            value: String,
            voltageFullCharge: Number,
            voltageAfterLowBattery: Number,
            batteryCapacityAfterDischarge: Number
        },

        // Battery Complaint (Lead Acid)
        batteryLeadAcid: {
            batteryNo: String,
            vehicleCurrent: String,
            voltageFullCharge: {
                b1: Number,
                b2: Number,
                b3: Number,
                b4: Number,
                b5: Number
            },
            voltageAfterLowBattery: {
                b1: Number,
                b2: Number,
                b3: Number,
                b4: Number,
                b5: Number
            },
            capacityAfterDischarge: {
                b1: Number,
                b2: Number,
                b3: Number,
                b4: Number,
                b5: Number
            }
        },

        // Motor Complaint
        motor: {
            motorNo: String,
            vehicleCurrent: String,
            diodeTest: {
                redBlack: String,
                redGreen: String,
                redBlue: String,
                redYellow: String
            },
            voltageTest: {
                redBlack: String,
                greenBlack: String,
                blueBlack: String,
                yellowBlack: String
            }
        },

        // Controller Complaint
        controller: {
            controllerNo: String,
            vehicleCurrent: String,
            continuityTest: {
                redBlack: { value: String, status: String },
                redGreen: { value: String, status: String },
                redBlue: { value: String, status: String },
                redYellow: { value: String, status: String }
            },
            voltageTest: {
                throttleIP: String,
                redBlack: String,
                hallSIP: String
            }
        },

        // Converter Complaint
        converter: {
            converterNo: String,
            otherReason: String,
            inputVoltage: Number,
            outputVoltage: Number
        }
    },

    createdBy: {
        type: String,
        default: 'system'
    }
}, {
    timestamps: true
});

// Auto-generate claim number, work order number, and defect code if not provided
warrantySchema.pre('save', async function (next) {
    if (!this.claimNumber) {
        // Use atomic counter to avoid race conditions with unique index
        const year = new Date().getFullYear();
        const count = await mongoose.connection.db.collection('counters').findOneAndUpdate(
            { _id: 'warrantyClaim' },
            { $inc: { seq: 1 } },
            { upsert: true, returnDocument: 'after' }
        );
        this.claimNumber = `WC-${year}-${String(count.seq).padStart(3, '0')}`;
    }

    // Auto-generate work order number
    if (!this.workOrderNumber) {
        const year = new Date().getFullYear();
        const count = await mongoose.connection.db.collection('counters').findOneAndUpdate(
            { _id: 'workOrder' },
            { $inc: { seq: 1 } },
            { upsert: true, returnDocument: 'after' }
        );
        this.workOrderNumber = `WO-${year}-${String(count.seq).padStart(3, '0')}`;
    }

    // Auto-generate defect code
    if (!this.defectCode) {
        const count = await mongoose.connection.db.collection('counters').findOneAndUpdate(
            { _id: 'defectCode' },
            { $inc: { seq: 1 } },
            { upsert: true, returnDocument: 'after' }
        );
        this.defectCode = `DEF-${String(count.seq).padStart(3, '0')}`;
    }

    next();
});

// Indexes for performance
warrantySchema.index({ status: 1 }); // Filter by status
warrantySchema.index({ claimType: 1 }); // Filter by claim type
warrantySchema.index({ chassisNumber: 1 }); // Lookup by chassis
// claimNumber already has unique:true, no need for additional index
warrantySchema.index({ createdAt: -1 }); // Sort by date

module.exports = mongoose.model('Warranty', warrantySchema);
