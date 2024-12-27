const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { registerUser, loginUser } = require('../services/authService');

// 1. Register user
const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!['User', 'Admin', 'Customer', 'Agent'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const response = await registerUser(username, password, role);
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

// 2. Login user
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const response = await loginUser(username, password);
        if (!response.success) {
            return res.status(response.status).json(response);
        }

        res.status(200).json({ message: 'Login successful', token: response.token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

module.exports = { register, login };
