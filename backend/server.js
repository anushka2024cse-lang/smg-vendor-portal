require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Connect to Database
// connectDB(); // Commented out until MONGO_URI is set

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Basic Health Check
app.get('/', (req, res) => {
    res.json({ message: 'SMG Vendor Portal API is running successfully!' });
});

// TODO: Import Routes
// app.use('/api/v1/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
