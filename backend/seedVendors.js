const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Vendor = require('./models/Vendor');

// Load environment variables
dotenv.config();

const vendorData = [
    {
        vendorId: 'V-001',
        name: 'Meenakshi Polymers Pvt Ltd',
        type: 'Pvt Ltd',
        city: 'New Delhi',
        status: 'Active',
        contact: 'Rajesh Kumar',
        email: 'rajesh@meenakshi.com',
        phone: '9876543210',
        address: { street: 'Plot No. 45, Okhla Industrial Estate', state: 'Delhi', zip: '110020', country: 'India' },
        tax: { pan: 'ABCDE1234F', gst: '07ABCDE1234F1Z1' },
        bank: { name: 'HDFC Bank', account: '1234567890', ifsc: 'HDFC0001234' }
    },
    {
        vendorId: 'V-002',
        name: 'NeoSky India Ltd',
        type: 'Ltd',
        city: 'Bangalore',
        status: 'Blocked',
        contact: 'Amit Singh',
        email: 'amit@neosky.in',
        phone: '9876543211',
        address: { street: 'Tech Park, Whitefield', state: 'Karnataka', zip: '560066', country: 'India' },
        tax: { pan: 'FGHIJ5678K', gst: '29FGHIJ5678K1Z5' },
        bank: { name: 'ICICI Bank', account: '0987654321', ifsc: 'ICIC0005678' }
    },
    {
        vendorId: 'V-003',
        name: 'Alpha Tech Components',
        type: 'Proprietorship',
        city: 'Pune',
        status: 'Active',
        contact: 'Sneha Gupta',
        email: 'sneha@alphatech.com',
        phone: '9876543212',
        address: { street: 'MIDC Chakan', state: 'Maharashtra', zip: '410501', country: 'India' },
        tax: { pan: 'KLMNO9012P', gst: '27KLMNO9012P1Z2' },
        bank: { name: 'SBI', account: '1122334455', ifsc: 'SBIN0001122' }
    }
];

const seedVendors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Optional: Clear existing
        await Vendor.deleteMany();
        console.log('Cleared existing vendors...');

        await Vendor.insertMany(vendorData);
        console.log('Vendors Seeded Successfully');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedVendors();
