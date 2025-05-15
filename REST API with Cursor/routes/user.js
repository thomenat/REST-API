import express from 'express';
import { signup, login } from '../models/user.js';
import { generateToken } from '../util/auth.js';

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const user = await signup(req.body);
        const token = generateToken(user);
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await login(email, password);
        const token = generateToken(user);
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            token
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

export default router; 