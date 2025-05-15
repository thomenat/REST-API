import express from 'express';
import { verifyToken } from '../util/auth.js';
import { 
    createEventController,
    getAllEventsController, 
    getEventByIdController,
    updateEventController,
    deleteEventController 
} from '../controllers/events-controller.js';

const router = express.Router();

// Middleware to verify JWT token
const authenticateUser = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        const decodedToken = verifyToken(token);
        req.userData = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Authentication failed' });
    }
};

// Create a new event
router.post('/', authenticateUser, createEventController);

// Get all events
router.get('/', getAllEventsController);

// Get event by id
router.get('/:id', getEventByIdController);

// Update an event
router.put('/:id', authenticateUser, updateEventController);

// Delete an event
router.delete('/:id', authenticateUser, deleteEventController);

export default router;
