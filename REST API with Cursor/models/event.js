import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../config/database.sqlite');

/**
 * Create a new event
 * @param {Object} eventData - Event details
 * @param {number} creatorId - ID of the user creating the event
 * @returns {Object} Created event
 */
async function createEvent(eventData, creatorId) {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    const { title, description, date, location } = eventData;
    
    const result = await db.run(
        'INSERT INTO events (title, description, date, location, creator_id) VALUES (?, ?, ?, ?, ?)',
        [title, description, date, location, creatorId]
    );

    const event = await db.get('SELECT * FROM events WHERE id = ?', result.lastID);
    await db.close();
    return event;
}

/**
 * Get all events
 * @returns {Array} List of all events
 */
async function getAllEvents() {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    const events = await db.all('SELECT * FROM events');
    await db.close();
    return events;
}

/**
 * Get a single event by ID
 * @param {number} eventId - ID of the event to retrieve
 * @returns {Object} Event details
 */
async function getEventById(eventId) {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    const event = await db.get('SELECT * FROM events WHERE id = ?', eventId);
    await db.close();
    return event;
}

/**
 * Update an event
 * @param {number} eventId - ID of the event to update
 * @param {Object} eventData - Updated event details
 * @param {number} userId - ID of the user making the update
 * @returns {Object} Updated event
 */
async function updateEvent(eventId, eventData, userId) {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    const event = await db.get(
        'SELECT * FROM events WHERE id = ? AND creator_id = ?',
        [eventId, userId]
    );

    if (!event) {
        throw new Error('Event not found or unauthorized');
    }

    const { title, description, date, location } = eventData;
    
    await db.run(
        'UPDATE events SET title = ?, description = ?, date = ?, location = ? WHERE id = ?',
        [title || event.title, description || event.description, date || event.date, location || event.location, eventId]
    );

    const updatedEvent = await db.get('SELECT * FROM events WHERE id = ?', eventId);
    await db.close();
    return updatedEvent;
}

/**
 * Delete an event
 * @param {number} eventId - ID of the event to delete
 * @param {number} userId - ID of the user making the deletion
 * @returns {boolean} True if deletion was successful
 */
async function deleteEvent(eventId, userId) {
    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    const event = await db.get(
        'SELECT * FROM events WHERE id = ? AND creator_id = ?',
        [eventId, userId]
    );

    if (!event) {
        throw new Error('Event not found or unauthorized');
    }

    await db.run('DELETE FROM events WHERE id = ?', [eventId]);
    await db.close();
    return true;
}

export {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
};
