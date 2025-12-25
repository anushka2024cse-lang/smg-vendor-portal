const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load Models
const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Ticket = require('./models/Ticket');
const Notification = require('./models/Notification');
const PurchaseOrder = require('./models/PurchaseOrder');
const Payment = require('./models/Payment');
const Component = require('./models/Component');
const Certificate = require('./models/Certificate');

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smg_vendor_portal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Import Data
const importData = async () => {
    try {
        // Clear DB
        await User.deleteMany();
        await Vendor.deleteMany();
        await Ticket.deleteMany();
        await Notification.deleteMany();
        await PurchaseOrder.deleteMany();
        await Payment.deleteMany();
        await Component.deleteMany();
        await Certificate.deleteMany();

        console.log('Data Destroyed...'.red.inverse);

        // --- USERS ---
        // Password: password123
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = await User.insertMany([
            {
                name: 'Super Admin',
                email: 'admin@smg.com',
                password: hashedPassword,
                role: 'superAdmin',
                department: 'IT',
                designation: 'System Administrator'
            },
            {
                name: 'Amit Sharma',
                email: 'amit@vendor.com',
                password: hashedPassword,
                role: 'user', // Vendor user
                department: 'Sales',
                designation: 'Sales Manager'
            },
            {
                name: 'Rahul Verma',
                email: 'rahul@vendor.com',
                password: hashedPassword,
                role: 'user', // Vendor user
                department: 'Logistics',
                designation: 'Logistics Head'
            },
            {
                name: 'Priya Singh',
                email: 'priya@smg.com',
                password: hashedPassword,
                role: 'admin',
                department: 'Procurement',
                designation: 'Procurement Officer'
            }
        ]);

        const adminUser = users[0];
        const vendorUser1 = users[1]; // Tech Solutions
        const vendorUser2 = users[2]; // Global Logistics
        const procurementUser = users[3];

        // --- VENDORS ---
        const vendors = await Vendor.insertMany([
            {
                user: vendorUser1._id,
                vendorId: 'V001',
                name: 'Tech Solutions Pvt Ltd',
                email: 'contact@techsolutions.com',
                phone: '9876543210',
                contact: 'Ramesh Gupta',
                address: {
                    street: '123, IT Park',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    zip: '560001'
                },
                tax: {
                    gst: '29ABCDE1234F1Z5',
                    pan: 'ABCDE1234F'
                },
                status: 'Active'
            },
            {
                user: vendorUser2._id,
                vendorId: 'V002',
                name: 'Global Logistics',
                email: 'info@globallogistics.com',
                phone: '9876543222',
                contact: 'Suresh Kumar',
                address: {
                    street: '45, Transport Nagar',
                    city: 'Delhi',
                    state: 'Delhi',
                    zip: '110001'
                },
                tax: {
                    gst: '07AAACE1234F1Z5',
                    pan: 'AAACE1234F'
                },
                status: 'Pending'
            }
        ]);

        const vendor1 = vendors[0];
        const vendor2 = vendors[1];

        // --- COMPONENTS ---
        const components = await Component.insertMany([
            {
                name: 'Lithium Ion Battery Pack',
                code: 'COMP-BAT-001',
                category: 'battery',
                unitPrice: 15000,
                unit: 'pcs',
                hsnCode: '85076000',
                gstRate: 18,
                status: 'Active',
                description: '72V 40Ah Battery Pack for E-Scooter'
            },
            {
                name: 'BLDC Motor 3kW',
                code: 'COMP-MOT-001',
                category: 'motor',
                unitPrice: 8500,
                unit: 'pcs',
                hsnCode: '85013119',
                gstRate: 18,
                status: 'Active',
                description: '3kW Hub Motor'
            },
            {
                name: 'Motor Controller',
                code: 'COMP-CON-001',
                category: 'controller',
                unitPrice: 4200,
                unit: 'pcs',
                hsnCode: '85371000',
                gstRate: 18,
                status: 'Active',
                description: 'Smart Controller for 3kW Motor'
            },
            {
                name: 'Disc Brake Assembly',
                code: 'COMP-BRK-001',
                category: 'brakes',
                unitPrice: 1200,
                unit: 'set',
                hsnCode: '87141090',
                gstRate: 18,
                status: 'Active',
                description: 'Front and Rear Disc Brake Set'
            }
        ]);

        // --- PURCHASE ORDERS ---
        const pos = await PurchaseOrder.insertMany([
            {
                poNumber: 'PO-202512-001',
                vendor: vendor1.name,
                vendorId: vendor1.vendorId, // Assuming PO schema just stores string/ID ref
                date: new Date('2025-12-15'),
                expectedDeliveryDate: new Date('2025-12-25'),
                status: 'Issued',
                items: [
                    {
                        componentCode: components[0].code,
                        componentName: components[0].name,
                        qty: 10,
                        unit: 'pcs',
                        unitPrice: 15000,
                        total: 150000
                    }
                ],
                subtotal: 150000,
                gst: 27000,
                totalAmount: 177000
            },
            {
                poNumber: 'PO-202512-002',
                vendor: vendor1.name,
                vendorId: vendor1.vendorId,
                date: new Date('2025-12-10'),
                expectedDeliveryDate: new Date('2025-12-20'),
                status: 'In Progress',
                items: [
                    {
                        componentCode: components[2].code,
                        componentName: components[2].name,
                        qty: 50,
                        unit: 'pcs',
                        unitPrice: 4200,
                        total: 210000
                    }
                ],
                subtotal: 210000,
                gst: 37800,
                totalAmount: 247800
            },
            {
                poNumber: 'PO-202512-003',
                vendor: vendor1.name,
                vendorId: vendor1.vendorId,
                date: new Date('2025-12-05'),
                expectedDeliveryDate: new Date('2025-12-15'),
                status: 'Completed',
                items: [
                    {
                        componentCode: components[1].code,
                        componentName: components[1].name,
                        qty: 20,
                        unit: 'pcs',
                        unitPrice: 8500,
                        total: 170000
                    }
                ],
                subtotal: 170000,
                gst: 30600,
                totalAmount: 200600
            }
        ]);

        // --- PAYMENTS ---
        await Payment.insertMany([
            {
                paymentNumber: 'PAY-2025-001',
                purchaseOrder: pos[2]._id,
                vendor: vendor1._id,
                invoiceNumber: 'INV-2025-001',
                invoiceDate: new Date('2025-12-05'),
                invoiceAmount: 200600,
                paymentAmount: 200600,
                netPayableAmount: 200600,
                remainingAmount: 0,
                status: 'Paid',
                paymentType: 'against-invoice',
                paymentMode: 'RTGS',
                transactionReference: 'HDFCR520251215',
                paymentDate: new Date('2025-12-15'),
                createdBy: procurementUser._id
            },
            {
                paymentNumber: 'PAY-2025-002',
                purchaseOrder: pos[1]._id,
                vendor: vendor1._id,
                invoiceNumber: 'INV-2025-002',
                invoiceDate: new Date('2025-12-10'),
                invoiceAmount: 247800,
                paymentAmount: 100000,
                netPayableAmount: 100000,
                remainingAmount: 147800,
                status: 'Processing',
                paymentType: 'partial',
                paymentMode: '-',
                createdBy: procurementUser._id
            }
        ]);

        // --- CERTIFICATES ---
        await Certificate.insertMany([
            {
                certificateNumber: 'CERT-001',
                certificateName: 'ISO 9001:2015',
                type: 'Quality',
                vendor: vendor1._id,
                issuingAuthority: 'TUV Nord',
                issueDate: new Date('2024-01-01'),
                expiryDate: new Date('2027-01-01'),
                remarks: 'Valid for all manufacturing units',
                createdBy: vendorUser1._id
            },
            {
                certificateNumber: 'CERT-002',
                certificateName: 'ISO 14001:2015',
                type: 'Environmental',
                vendor: vendor1._id,
                issuingAuthority: 'BSI',
                issueDate: new Date('2024-03-15'),
                expiryDate: new Date('2027-03-15'),
                remarks: 'Environmental Management System',
                createdBy: vendorUser1._id
            }
        ]);

        // --- TICKETS --- (Existing logic kept)
        await Ticket.insertMany([
            {
                user: vendorUser1._id,
                subject: 'Billing Inquiry',
                message: 'I have a question regarding invoice #4022. The amount seems incorrect.',
                status: 'Open',
                priority: 'High'
            },
            {
                user: vendorUser2._id,
                subject: 'Login Issue',
                message: 'Unable to reset my password. Please assist.',
                status: 'Resolved',
                priority: 'Medium'
            },
            {
                user: vendorUser1._id,
                subject: 'New Material Request',
                message: 'We need approval for the new raw material shipment.',
                status: 'In Progress',
                priority: 'Low'
            }
        ]);

        // --- NOTIFICATIONS ---
        await Notification.insertMany([
            {
                recipient: vendorUser1._id,
                type: 'info',
                title: 'Welcome to SMG Portal',
                message: 'Your account has been successfully created.',
                isRead: false
            },
            {
                recipient: vendorUser1._id,
                type: 'success',
                title: 'PO Approved',
                message: 'Purchase Order #PO-2025-001 has been approved.',
                isRead: true
            },
            {
                recipient: adminUser._id,
                type: 'warning',
                title: 'System Maintenance',
                message: 'Scheduled maintenance on Dec 25th at 10 PM.',
                isRead: false
            }
        ]);


        // --- SEED SPARE PART REQUESTS ---
        const spareParts = [
            { requestId: 'SPR-2025-001', vendor: vendors[0]._id, vendorName: vendors[0].name, component: 'Casing Type-A', quantity: 50, priority: 'High', status: 'Pending', dueDate: '2025-12-30' },
            { requestId: 'SPR-2025-002', vendor: vendors[1]._id, vendorName: vendors[1].name, component: 'Motor Controller', quantity: 10, priority: 'Medium', status: 'Approved', dueDate: '2025-12-28' },
        ];
        await SparePartRequest.insertMany(spareParts);
        console.log('Seeded Spare Part Requests...');

        // --- SEED HSRP REQUESTS ---
        const hsrpRequests = [
            { requestId: 'HSRP-2025-001', vendor: vendors[0]._id, vendorName: vendors[0].name, vehicleModel: 'Hero Splendor', regNumber: 'DL 01 AB 1234', chassisNumber: 'CH12345', engineNumber: 'EN12345', status: 'Pending' },
            { requestId: 'HSRP-2025-002', vendor: vendors[1]._id, vendorName: vendors[1].name, vehicleModel: 'TVS Jupiter', regNumber: 'KA 05 XY 9876', chassisNumber: 'CH98765', engineNumber: 'EN98765', status: 'Dispatched' },
        ];
        await HSRPRequest.insertMany(hsrpRequests);
        console.log('Seeded HSRP Requests...');

        // --- SEED RSA REQUESTS ---
        const rsaRequests = [
            { requestId: 'RSA-2025-001', vendor: vendors[0]._id, vendorName: vendors[0].name, vehicleNumber: 'DL 01 AA 1111', driverContact: '9876543210', location: 'Sector 62, Noida', issueType: 'Battery Dead', status: 'Active' },
            { requestId: 'RSA-2025-002', vendor: vendors[1]._id, vendorName: vendors[1].name, vehicleNumber: 'UP 16 BB 2222', driverContact: '9812345678', location: 'Yamuna Expressway', issueType: 'Flat Tyre', status: 'Resolved' },
        ];
        await RSARequest.insertMany(rsaRequests);
        console.log('Seeded RSA Requests...');

        // --- SEED DIE PLANS ---
        const diePlans = [
            { planId: 'DP-2025-001', vendor: vendors[0]._id, vendorName: vendors[0].name, partName: 'Rear Fender Casing', stage: 'Machining', progress: 45, startDate: '2025-11-01', targetDate: '2026-01-15', status: 'On Track' },
            { planId: 'DP-2025-002', vendor: vendors[1]._id, vendorName: vendors[1].name, partName: 'Handlebar Grip', stage: 'Trials T0', progress: 80, startDate: '2025-10-15', targetDate: '2025-12-30', status: 'On Track' },
        ];
        await DiePlan.insertMany(diePlans);
        console.log('Seeded Die Plans...');

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Vendor.deleteMany();
        await Ticket.deleteMany();
        await Notification.deleteMany();
        await PurchaseOrder.deleteMany();
        await Payment.deleteMany();

        // Clear new collections
        await SparePartRequest.deleteMany({});
        await HSRPRequest.deleteMany({});
        await RSARequest.deleteMany({});
        await DiePlan.deleteMany({});
        console.log('Cleared Spare Parts, HSRP, RSA, Die Plans...');

        console.log('Data Destroyed!'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
