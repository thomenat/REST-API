import jwt from 'jsonwebtoken';

// Secret key for JWT signing - in production this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object containing id and email
 * @returns {string} JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            email: user.email
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload if valid
 * @throws {Error} If token is invalid or expired
 */
const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export {
    generateToken,
    verifyToken
};
