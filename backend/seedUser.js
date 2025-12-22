const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Check if user exists
        const userExists = await User.findOne({ email: 'admin@smg.com' });

        if (userExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        // Create Admin User
        const user = await User.create({
            name: 'Admin User',
            email: 'admin@smg.com',
            password: 'password123',
            role: 'Admin'
        });

        console.log(`Admin User Created: ${user.email} / password123`);
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedUser();
