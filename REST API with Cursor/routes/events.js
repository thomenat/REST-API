import express from 'express';
import { verifyToken } from '../util/auth.js';
import { 
    createEventController,
    getAllEventsController, 
    getEventByIdController,
    updateEventController,
    deleteEventController,
    registerForEventController,
    unregisterForEventController 
} from '../controllers/events-controller.js';
import { upload } from '../util/upload.js';

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
router.post('/', authenticateUser, upload.single('image'), createEventController);

// Get all events
router.get('/', getAllEventsController);

// Get event by id
router.get('/:id', getEventByIdController);

// Update an event
router.put('/:id', authenticateUser, upload.single('image'), updateEventController);

// Delete an event
router.delete('/:id', authenticateUser, deleteEventController);


router.post('/:id/register', authenticateUser, registerForEventController);

router.post('/:id/unregister', authenticateUser, unregisterForEventController);

export default router;
