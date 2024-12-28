
const express = require('express');
const axios = require('axios');  // Axios for making HTTP requests
const Quotation = require('../models/quotationModel');
const { authenticate, authorize, getAuthKey } = require('../middleware/authMiddleware');


const router = express.Router();

// POST API for getting quotation
router.post('/quotation',  authenticate, authorize(), async (req, res) => {
    try {
        // URL for the external API
        const apiUrl = 'https://sandbox-sg-gw.insuremo.com/grandiosesg/1.0/pa-bff-app/v1/policy/quotation';

        const token =await getAuthKey();
        console.log('quotation token-->', token)

        // If the token is not present, send an error
        if (!token) {
            return res.status(403).json({ message: 'Authorization token is required' });
        }

        // Send request to the external API
        const response = await axios.post(apiUrl, req.body, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // Send a response back to the client
        res.status(201).json({
            message: 'Quotation generated successfully',
            data: response.data
        });
    } catch (error) {
        console.error('Error fetching quotation:', error);
        res.status(500).json({ message: 'Error generating quotation', error: error.message });
    }
});

module.exports = router;
