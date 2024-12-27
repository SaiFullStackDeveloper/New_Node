const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers['token'];
    console.log('token-->', token)
    if (!token) return res.status(403).json({ message: 'Token required' });

    try {
        const decoded = jwt.verify(token, 'secretKey');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const authorize = () => (req, res, next) => {
    const roles = ['Admin', 'User']; // add the accessed roles here
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

module.exports = { authenticate, authorize };
