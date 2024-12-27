const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const { connectToDatabase } = require('./config/db');
const quotationRoutes = require('./routes/quotationRoutes'); 
const proposalRoutes = require('./routes/proposalRoute'); 
const policyRoutes = require('./routes/policyRoute');
const vpcRoutes = require('./routes/vpc_vehicleMaster');


const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use('/api', authRoutes);  // Auth routes
app.use('/api', quotationRoutes);  // Quotation routes
app.use('/api', proposalRoutes);  // Proposal routes
app.use('/api', policyRoutes);  // Policy routes
app.use('/api', vpcRoutes);  // Vpc Vehicle Master routes

connectToDatabase();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
