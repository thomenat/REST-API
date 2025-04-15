const db = require('../config/database');

const signup = (userData) => {
    try {
        // Check if user already exists
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const existingUser = stmt.get(userData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Insert new user
        const insertStmt = db.prepare(`
            INSERT INTO users (email, password, name)
            VALUES (?, ?, ?)
        `);
        const result = insertStmt.run(userData.email, userData.password, userData.name);

        // Get the newly created user
        const selectStmt = db.prepare('SELECT * FROM users WHERE id = ?');
        const newUser = selectStmt.get(result.lastID);
        return newUser;
    } catch (error) {
        throw error;
    }
};

const login = (email, password) => {
    try {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
        const user = stmt.get(email, password);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        return user;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    signup,
    login
}; 