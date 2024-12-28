
const express = require('express');
const axios = require('axios');  // For making HTTP requests
const Application = require('../models/proposalModel');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();



// GET API for a Proposal application
router.get('/proposal-application', async (req, res) => {
    try {
        const proposals = await Application.find();
        res.status(200).json(proposals);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching proposals', error });
      }
});


// POST API for submitting a policy application
router.post('/proposal-application', authenticate, authorize(), async (req, res) => {
    try {
        // URL for the external API
        const apiUrl = 'https://sandbox-sg-gw.insuremo.com/grandiosesg/1.0/pa-bff-app/v1/policy/application';

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
            proposalNo: applicationData.ProposalNo,  // Use the appropriate field from the response
            proposalDetails: applicationData,  // Adjust as needed
            proposalStatus: applicationData.ProposalStatus,  // Adjust as needed
        });

        await newApplication.save();

        // Send a response back to the client
        res.status(201).json({
            message: 'Policy application submitted successfully',
            data: newApplication
        });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ message: 'Error submitting policy application', error: error.message });
    }
});

module.exports = router;
