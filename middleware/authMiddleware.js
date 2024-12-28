const jwt = require('jsonwebtoken');
const axios = require('axios');

const authenticate = (req, res, next) => {
    const token = req.headers['token'];
    if (!token) return res.status(403).json({ message: 'Token required' });
    try {
        const decoded = jwt.verify(token, 'secretKey');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const authorize = () => (req, res, next) => {
    const roles = ['Admin', 'User']; // add the accessed roles here
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};


//  To get the authentication key from the 3rd party API.
const getAuthKey = async () => {
    try {
      // Define base URL and authentication endpoint
      const baseUrl = 'https://grandiosesg-sandbox-sg.insuremo.com';
      const authUrl = `${baseUrl}/cas/ebao/v2/json/tickets`;
  
      // Define credentials and headers
      const credentials = {
        username: 'Grandiose.User',
        password: 'Grandiose@1234',
      };
  
      const headers = {
        'x-mo-client-id': 'key',
        'x-mo-tenant-id': 'grandiosesg',
        'x-mo-user-source-id': 'platform',
      };
  
      // Make the POST request to fetch the token
      const authResponse = await axios.post(authUrl, credentials, { headers });
  
      // Validate response and check if token exists
      if (!authResponse || !authResponse.data || !authResponse.data.access_token) {
        throw new Error('Authentication failed: Missing access token in response');
      }
  
      const authToken = authResponse.data.access_token;
      console.log('authtoken-->', authToken)
  
      // Log success for debugging purposes
      console.log('Authentication successful, token retrieved.');
  
      return authToken;
    } catch (error) {
      // Log error details
      console.error('Error fetching authentication token:', error.message);
  
      // Add specific error details if available
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
  
      // Re-throw error for the calling function to handle
      throw new Error('Failed to get authentication key. Please check your credentials and network.');
    }
  };
  

module.exports = { authenticate, authorize, getAuthKey };
