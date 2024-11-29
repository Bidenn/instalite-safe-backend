const { Auth, Profile } = require('../models');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/emailService');
const { Op } = require('sequelize');
const JWT_SECRET = process.env.JWT_SECRET;

// Register and Send Email Verification
const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Password validation regex
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                error: 'Password does not meet the required criteria.',
            });
        }

        // Check if the user already exists
        const existingUser = await Auth.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Hash password
        const hashedPassword = await argon2.hash(password);

        // Create verification token
        const verificationToken = jwt.sign({ email, hashedPassword }, JWT_SECRET, { expiresIn: '1h' });

        // Send verification email with token
        await sendVerificationEmail(email, verificationToken);

        res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Failed to register' });
    }
};

// Verify email and create user profile
const verifyEmail = async (req, res) => {
    const token = req.query.encodedToken;

    try {
        if (!token) {
            return res.status(400).json({ error: 'Missing verification token' });
        }

        // Decode the token
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { email, password } = decodedToken;

        // Create the Auth user
        const auth = await Auth.create({
            email: email,
            password: password,
        });

        // Create associated Profile
        await Profile.create({
            userId: auth.id,
            fullName: '',
            profilePhoto: '',
            career: '',
            bio: '',
            isPrivate: false,
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

        // Validate input
        if (!UsernameOrEmail || !Password) {
            return res.status(400).json({ error: 'Username/Email and password are required' });
        }

        // Find user by email or username
        const auth = await Auth.findOne({
            where: { [Op.or]: [{ email: UsernameOrEmail }, { username: UsernameOrEmail }] },
        });

        if (!auth) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await argon2.verify(auth.password, Password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create JWT token (excluding password)
        const { password: _, ...userWithoutPassword } = auth.toJSON();
        const jwtToken = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: '7d' });

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

// Request Reset Password (send email with reset link)
const getResetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate input
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Create reset password token (valid for 1 hour)
        const resetToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

        // Send reset email with the token
        await sendVerificationEmail(email, resetToken);

        res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
    } catch (error) {
        console.error('Error during reset password:', error);
        res.status(500).json({ error: 'Failed to send email verification' });
    }
};

// Store Reset Password (after email verification)
const storeResetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Validate input
        if (!token || !newPassword) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }

        // Verify the reset token
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { email } = decodedToken;

        // Validate password (similar to registration)
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                error: 'Password does not meet the required criteria.',
            });
        }

        // Find the user by email
        const auth = await Auth.findOne({ where: { email } });

        if (!auth) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await argon2.hash(newPassword);

        // Update the user's password
        auth.password = hashedPassword;
        await auth.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
};

module.exports = { register, verifyEmail, login, logout, getResetPassword, storeResetPassword };
