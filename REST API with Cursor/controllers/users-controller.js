import { signup, login } from '../models/user.js';
import { generateToken } from '../util/auth.js';

export async function handleSignup(req, res) {
    try {
        const { email, password, name } = req.body;
        
        // Validate required fields
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }
        
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
            return res.status(400).json({ 
                error: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
            });
        }

        const newUser = await signup({ email, password, name });
        const token = generateToken(newUser);
        
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name
            },
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate required fields
        if (!email?.trim() || !password?.trim()) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

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
}; 