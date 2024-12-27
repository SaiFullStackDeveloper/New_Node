const express = require('express');
const { register, login } = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Example protected route
router.get('/admin', authenticate, authorize(['Admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome, Admin!' });
});

module.exports = router;
