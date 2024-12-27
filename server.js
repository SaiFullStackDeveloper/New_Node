const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const { connectToDatabase } = require('./config/db');
const quotationRoutes = require('./routes/quotationRoutes'); 
const proposalRoutes = require('./routes/proposalRoute'); 

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api', authRoutes);  // Auth routes
app.use('/api', quotationRoutes);  // Quotation routes
app.use('/api', proposalRoutes);  // Quotation routes

connectToDatabase();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
