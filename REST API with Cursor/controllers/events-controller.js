import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from '../models/event.js';

/**
 * Create a new event
 * @param {Object} req - Request object containing event data and user info
 * @param {Object} res - Response object
 */
export async function createEventController(req, res) {
    try {
        const eventData = req.body;
        const creatorId = req.userData.userId;

        // Validate required fields
        const { title, description, date, location } = eventData;

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

        // Validate date is valid
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
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
        
        const updatedEvent = await updateEvent(eventId, eventData, userId);
        res.status(200).json(updatedEvent);
    } catch (error) {
        if (error.message === 'Event not found or unauthorized') {
            return res.status(404).json({ error: error.message });
        }
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
        
        await deleteEvent(eventId, userId);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        if (error.message === 'Event not found or unauthorized') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
}
