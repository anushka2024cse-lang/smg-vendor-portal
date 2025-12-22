require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Connect to Database
connectDB();


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

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/inventory', require('./routes/inventory'));
app.use('/api/v1/vendors', require('./routes/vendor'));
app.use('/api/v1/purchase-orders', require('./routes/purchaseOrder'));
app.use('/api/v1/components', require('./routes/components'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
