const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const { connectToDatabase } = require('./config/db');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api', authRoutes);

connectToDatabase();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
