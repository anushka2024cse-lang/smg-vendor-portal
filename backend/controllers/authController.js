const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'User'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide an email and password' });
        }

        // Hardcoded Admin Access (Requested feature for consoleadmin@smg.com)
        if (email === 'consoleadmin@smg.com' && password === 'password123') {
            return res.json({
                _id: 'admin-console-id',
                name: 'Console Admin',
                email: 'consoleadmin@smg.com',
                role: 'admin',
                token: generateToken('admin-console-id')
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        console.log('📝 Profile update request from user:', req.user?.id);
        console.log('📝 Request body:', req.body);

        if (!req.user || !req.user.id) {
            console.log('❌ req.user is missing!');
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { name, email, phone, department, designation } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            console.log('❌ User not found in database:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('✅ Found user:', user.email);

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (department) user.department = department;
        if (designation) user.designation = designation;

        await user.save();

        console.log('✅ Profile updated successfully!');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                department: user.department,
                designation: user.designation,
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ Profile update ERROR:', error.message);
        console.error('Stack trace:', error.stack);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Admin authentication
// @route   POST /api/v1/auth/admin-login
// @access  Public
exports.adminLogin = async (req, res) => {
    try {
        const { adminKey } = req.body;

        // Validate admin key against environment variable
        if (!process.env.ADMIN_KEY) {
            console.error('❌ ADMIN_KEY not set in environment variables');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        if (adminKey !== process.env.ADMIN_KEY) {
            console.log('❌ Invalid admin key attempt');
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        // Generate token for admin
        const token = generateToken('admin-user-id');

        res.json({
            token,
            role: 'Super Admin',
            message: 'Admin authenticated successfully'
        });
    } catch (error) {
        console.error('❌ Admin login error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
