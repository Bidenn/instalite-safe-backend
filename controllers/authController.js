const { User } = require('../models');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const JWT_SECRET = process.env.JWT_SECRET;

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

        User.create({
            email: email,
            password: hashedPassword,
        });

        res.status(200).json({ message: 'Registration Success' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Failed to register' });
    }
};

const login = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        if (!usernameOrEmail || !password) {
            return res.status(400).json({ error: 'Username / Email and Password are required' });
        }

        const auth = await User.findOne({
            where: { [Op.or]: [{ email: usernameOrEmail }, { username: usernameOrEmail }] },
        });

        if (!auth) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await argon2.verify(auth.password, password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const { password: _, ...userWithoutPassword } = auth.toJSON();

        const jwtToken = jwt.sign(userWithoutPassword, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token: jwtToken });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};

const logout = async (req, res) => {
    try {
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Failed to logout' });
    }
};

module.exports = { register, login, logout };
