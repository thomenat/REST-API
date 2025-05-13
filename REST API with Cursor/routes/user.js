const express = require('express');
const router = express.Router();
const { signup, login } = require('../models/user');

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const user = await signup(req.body);
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
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
        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

module.exports = router; 