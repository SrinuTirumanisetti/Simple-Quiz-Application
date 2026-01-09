const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Quiz Application API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT;
if (!PORT) {
    console.error('PORT is not defined in environment variables');
    process.exit(1);
}
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});