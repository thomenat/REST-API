const express = require('express');
const userRoutes = require('./routes/user');
const createDatabase = require('./config/database');

async function startServer() {
    const app = express();

    // Init DB
    const db = await createDatabase();

    // Middleware
    app.use(express.json());

    // Routes
    app.use('/user', userRoutes);

    // Error handling
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({ error: 'Something went wrong!' });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer().catch(err => {
    console.error('Failed to start server:', err);
});
