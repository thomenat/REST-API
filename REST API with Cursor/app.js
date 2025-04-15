const express = require('express');
const userRoutes = require('./routes/user');
require('./config/database'); // Import database configuration

const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/user', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
