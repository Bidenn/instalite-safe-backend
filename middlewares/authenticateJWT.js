const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env.JWT_SECRET; 

const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, auth) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.auth = auth;
        next();
    });
};

module.exports = { authenticateJWT };
