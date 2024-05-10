const jwt = require('jsonwebtoken');

// Middleware function to authenticate JWT token
const authenticateToken = (req, res, next) => {
    // Get JWT token from request headers
    const token = req.headers['authorization'];

    // Check if token is not provided
    if (!token) {
        return res.status(401).json({ message: 'Authentication token is required' });
    }

    try {
        // Verify token and decode payload
        const decoded = jwt.verify(token, 'bookswap');

        // Attach user information to request object
        req.user = decoded;

        // Proceed to next middleware
        next();
    } catch (error) {
        // Token verification failed
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateToken;
