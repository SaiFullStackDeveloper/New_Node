
const express = require('express');
const axios = require('axios');  // Axios for making HTTP requests
const Quotation = require('../models/quotationModel');
const { authenticate, authorize, getAuthKey } = require('../middleware/authMiddleware');


const router = express.Router();

// POST API for getting quotation
router.post('/vpc-vehicle-master', async (req, res) => {
    try {
        // URL for the external API
        const apiUrl = 'https://grandiosesg-sandbox-sg.insuremo.com/api/platform/dd/code/cache/v1/record/list/byName?name=VPC_VehicleMaster';

        const token = await getAuthKey();

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
            message: 'Vpc Vehicle Master data generated successfully',
            data: response.data
        });
    } catch (error) {
        console.error('Error fetching quotation:', error);
        res.status(500).json({ message: 'Error generating quotation', error: error.message });
    }
});

module.exports = router;
