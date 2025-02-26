const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        let token = req.header('Authorization');

        if (token && token.startsWith('Bearer ')) {
            token = token.split(' ')[1]; // Extract token from "Bearer <token>"
        } else {
            token = req.cookies.token; // Try to get token from cookies
        }

        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (roles.length && !roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
            }

            next();
        } catch (error) {
            res.status(401).json({ message: 'Invalid token' });
        }
    };
};

module.exports = authMiddleware;
