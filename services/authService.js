const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// 1. Register service logic
const registerUser = async (username, password, role) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    return { message: 'User registered successfully' };
};

// 2. Login service logic
const loginUser = async (username, password) => {
    const user = await User.findOne({ username });
    if (!user) return { success: false, status: 404, message: 'User not found' };

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return { success: false, status: 401, message: 'Invalid credentials' };

    const token = jwt.sign({ id: user._id, role: user.role }, 'secretKey', { expiresIn: '1h' });

    return { success: true, token };
};

module.exports = { registerUser, loginUser };
