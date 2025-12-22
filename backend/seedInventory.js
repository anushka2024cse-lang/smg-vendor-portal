const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Inventory = require('./models/Inventory');

// Load environment variables
dotenv.config();

const inventoryData = [
    { name: 'Steel Sheet 2mm', sku: 'RM-STL-001', category: 'Raw Material', quantity: 500, unit: 'sheets', location: 'Warehouse A', minLevel: 50, valuePerUnit: 1200 },
    { name: 'Aluminum Ingot', sku: 'RM-ALU-002', category: 'Raw Material', quantity: 200, unit: 'kg', location: 'Warehouse A', minLevel: 30, valuePerUnit: 450 },
    { name: 'Copper Wire 10g', sku: 'RM-COP-003', category: 'Raw Material', quantity: 1000, unit: 'm', location: 'Warehouse B', minLevel: 200, valuePerUnit: 15 },
    { name: 'Seat Assembly', sku: 'CMP-SEAT-001', category: 'Components', quantity: 45, unit: 'pcs', location: 'Shelf C1', minLevel: 10, valuePerUnit: 850 },
    { name: 'Headlight Unit', sku: 'CMP-LGHT-005', category: 'Components', quantity: 80, unit: 'pcs', location: 'Shelf C2', minLevel: 15, valuePerUnit: 450 },
    { name: 'Brake Caliper', sku: 'CMP-BRK-010', category: 'Components', quantity: 120, unit: 'pcs', location: 'Shelf C3', minLevel: 20, valuePerUnit: 675 }
];

const seedInventory = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        await Inventory.deleteMany(); // Clear existing data logic if needed, or check exists
        console.log('Cleared existing inventory...');

        await Inventory.insertMany(inventoryData);
        console.log('Inventory Seeded Successfully');

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedInventory();
