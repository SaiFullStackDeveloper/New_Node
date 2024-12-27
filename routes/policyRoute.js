
const express = require('express');
const axios = require('axios');  // For making HTTP requests
const Application = require('../models/proposalModel');
const { authenticate, authorize } = require('../middleware/authMiddleware');


const router = express.Router();

// POST API for submitting a policy application
router.post('/policy-issuance', authenticate, authorize() , async (req, res) => {
    try {
        // URL for the external API
        const apiUrl = 'https://sandbox-sg-gw.insuremo.com/grandiosesg/1.0/pa-bff-app/v1/policy/issuePolicy';

        const token = req.headers['authorization'];

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

        // Store the application response in MongoDB
        const applicationData = response.data;  // Adjust based on the actual API response structure
        const newApplication = new Application({
            policyNo: applicationData.PolicyNo,  // Use the appropriate field from the response
            policyDetails: applicationData,  // Adjust as needed
            PolicyStatus: applicationData.PolicyStatus,  // Adjust as needed
        });

        await newApplication.save();

        // Send a response back to the client
        res.status(201).json({
            message: 'Policy Issuance submitted successfully',
            data: newApplication
        });
    } 
    catch (error) {
        let errorMessage =  error.message;
        if (error.response) {
            const rawMessage = error.response.data.rawMessage;
            if (rawMessage) {
                errorMessage = JSON.parse(rawMessage.split(']: ')[1])[0].message;
            } else {
                errorMessage = error.response.data.message || 'An error occurred'
            }
        } 
        res.status(500).json({ message: 'Error submitting policy application', error: errorMessage});
    }
});

module.exports = router;
