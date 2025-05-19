import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.js';
import eventRoutes from './routes/events.js';
import createDatabase from './config/database.js';

async function startServer() {
    const app = express();

    // Init DB
    const db = await createDatabase();

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.static('public'));

    // Routes
    app.use('/user', userRoutes);
    app.use('/events', eventRoutes);

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
