const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Create Admin User
        const adminExists = await User.findOne({ email: 'admin@smg.com' });
        if (!adminExists) {
            const adminUser = await User.create({
                name: 'Admin User',
                email: 'admin@smg.com',
                password: 'password123',
                role: 'admin'
            });
            console.log(`✅ Admin User Created: ${adminUser.email} / password123`);
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // Create Vendor Manager User
        const managerExists = await User.findOne({ email: 'manager@smg.com' });
        if (!managerExists) {
            const managerUser = await User.create({
                name: 'Vendor Manager',
                email: 'manager@smg.com',
                password: 'password123',
                role: 'vendorManager'
            });
            console.log(`✅ Vendor Manager Created: ${managerUser.email} / password123`);
        } else {
            console.log('ℹ️  Vendor Manager already exists');
        }

        console.log('\n🎉 User seeding completed!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

seedUser();
