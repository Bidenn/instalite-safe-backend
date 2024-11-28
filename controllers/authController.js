const User = require('../models/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/emailService');
const { Op } = require('sequelize');

const JWT_SECRET = process.env.JWT_SECRET;

// Register a new user
const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: 'Password does not meet the required criteria.',
            });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const hashedPassword = await argon2.hash(password);

        const verificationToken = jwt.sign({ email, password: hashedPassword }, JWT_SECRET, { expiresIn: '1h' });

        await sendVerificationEmail(email, verificationToken);

        res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Failed to register' });
    }
};

// Verify email
const verifyEmail = async (req, res) => {
    const token = req.query.encodedToken;
    
    try {
        if (!token) {
            return res.status(400).json({ error: 'Missing verification token' });
        }
        // Decode token
        const decodedToken = jwt.verify(token, JWT_SECRET);

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email: decodedToken.email } });

        if (existingUser) {
            return res.status(400).json({ error: 'Email is already verified. Please log in.' });
        }

        // Create a new user if not found
        const user = await User.create({
            email: decodedToken.email,
            password: decodedToken.password,
        });

        res.status(201).json({ message: 'Email verified successfully. You can now log in.' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(400).json({ error: 'Invalid or expired token' });
    }
};


// Login
const login = async (req, res) => {
    try {
        const { UsernameOrEmail, Password } = req.body;

        console.log(UsernameOrEmail);

        if (!UsernameOrEmail || !Password) {
            return res.status(400).json({ error: 'Username/Email and password are required' });
        }

        const user = await User.findOne({
            where: { [Op.or]: [{ email: UsernameOrEmail }, { username: UsernameOrEmail }] },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await argon2.verify(user.password, Password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const { password: _, ...userWithoutPassword } = user.toJSON();

        // Generate JWT token
        const tokenPayload = { ...userWithoutPassword };

        const jwtToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({ message: 'Login successful', token: jwtToken });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};

// Logout (optional for JWT-based authentication)
const logout = async (req, res) => {
    try {
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Failed to logout' });
    }
};

module.exports = { register, verifyEmail, login, logout };
