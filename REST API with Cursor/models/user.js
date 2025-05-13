const createDatabase = require('../config/database');
const bcrypt = require('bcryptjs');

const signup = async (userData) => {
    try {
        const db = await createDatabase();

        // Check if user already exists
        const existingUser = await db.get(
            'SELECT * FROM users WHERE email = ?',
            userData.email
        );
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(userData.password, 10); // 10 = salt rounds

        // Verify user credentials
        const verifyCredentials = async (email, password) => {
            const db = await createDatabase();
            
            // Get user by email
            const user = await db.get(
                'SELECT * FROM users WHERE email = ?',
                email
            );

            if (!user) {
                return { isValid: false, error: 'Invalid credentials' };
            }

            // Compare hashed passwords
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return { isValid: false, error: 'Invalid credentials' };
            }

            return { isValid: true, user: { id: user.id, email: user.email, name: user.name } };
        };

        // Insert new user
        const result = await db.run(
            `INSERT INTO users (email, password, name)
             VALUES (?, ?, ?)`,
            userData.email,
            hashedPassword,
            userData.name
        );

        // Get the newly created user (excluding password)
        const newUser = await db.get(
            'SELECT id, email, name, created_at FROM users WHERE id = ?',
            result.lastID
        );

        return newUser;
    } catch (error) {
        throw error;
    }
};

const login = async (email, password) => {
    try {
        const db = await createDatabase();

        // Get user by email
        const user = await db.get(
            'SELECT * FROM users WHERE email = ?',
            email
        );

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Compare hashed passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // Optional: remove password from returned user
        const { password: _, ...safeUser } = user;
        return safeUser;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    signup,
    login
};
