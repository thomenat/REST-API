import { 
    createEvent, 
    getAllEvents, 
    getEventById, 
    updateEvent, 
    deleteEvent,
    checkUserRegistration,
    registerUserForEvent,
    unregisterUserFromEvent 
} from '../models/event.js';

/**
 * Create a new event
 * @param {Object} req - Request object containing event data and user info
 * @param {Object} res - Response object
 */
export async function createEventController(req, res) {
    try {
        const eventData = req.body;
        const creatorId = req.userData.userId;
        const image = req.file;

        // Validate required fields
        const { title, description, date, location } = eventData;

        // Validation
        if (!title?.trim()) {
            return res.status(400).json({ error: 'Title is required' });
        }

        if (!description?.trim()) {
            return res.status(400).json({ error: 'Description is required' });
        }

        if (!location?.trim()) {
            return res.status(400).json({ error: 'Location is required' });
        }

        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        if (image && !image.mimetype.startsWith('image/')) {
            return res.status(400).json({ error: 'File must be an image' });
        }

        // Validate date is valid
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        // Add image path to event data if image was uploaded
        if (image) {
            eventData.image_path = image.path;
        }

        const event = await createEvent(eventData, creatorId);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Get all events
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export async function getAllEventsController(req, res) {
    try {
        const events = await getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Get a single event by ID
 * @param {Object} req - Request object containing event ID
 * @param {Object} res - Response object
 */
export async function getEventByIdController(req, res) {
    try {
        const eventId = req.params.id;
        const event = await getEventById(eventId);
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }
        
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Update an existing event
 * @param {Object} req - Request object containing event data and user info
 * @param {Object} res - Response object
 */
export async function updateEventController(req, res) {
    try {
        const eventId = req.params.id;
        const eventData = req.body;
        const userId = req.userData.userId;
        const image = req.file;

        // Get the existing event first
        const existingEvent = await getEventById(eventId);
        
        if (!existingEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Handle image upload if present
        if (image && !image.mimetype.startsWith('image/')) {
            return res.status(400).json({ error: 'File must be an image' });
        }

        // Add image path to event data if new image was uploaded
        if (image) {
            eventData.image_path = image.path;
        }
        
        // Check if the user is the owner of the event
        if (existingEvent.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized - you can only edit your own events' });
        }
        
        const updatedEvent = await updateEvent(eventId, eventData, userId);
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Delete an event
 * @param {Object} req - Request object containing event ID and user info
 * @param {Object} res - Response object
 */
export async function deleteEventController(req, res) {
    try {
        const eventId = req.params.id;
        const userId = req.userData.userId;

        // Get the existing event first
        const existingEvent = await getEventById(eventId);
        
        if (!existingEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if the user is the owner of the event
        if (existingEvent.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized - you can only delete your own events' });
        }
        
        await deleteEvent(eventId, userId);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function registerForEventController(req, res) {
    try {
        const eventId = req.params.id;
        const userId = req.userData.userId;

        // Get the existing event first
        const existingEvent = await getEventById(eventId);
        
        if (!existingEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if user is already registered
        const isRegistered = await checkUserRegistration(eventId, userId);
        if (isRegistered) {
            return res.status(400).json({ error: 'You are already registered for this event' });
        }

        // Register user for the event
        await registerUserForEvent(eventId, userId);
        res.status(200).json({ message: 'Successfully registered for event' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function unregisterForEventController(req, res) {
    try {
        const eventId = req.params.id;
        const userId = req.userData.userId;

        // Get the existing event first
        const existingEvent = await getEventById(eventId);
        
        if (!existingEvent) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if user is registered
        const isRegistered = await checkUserRegistration(eventId, userId);
        if (!isRegistered) {
            return res.status(400).json({ error: 'You are not registered for this event' });
        }

        // Unregister user from the event
        await unregisterUserFromEvent(eventId, userId);
        res.status(200).json({ message: 'Successfully unregistered from event' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}