const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://localhost:27017/roleAuthApp';

const connectToDatabase = () => {
    // Connect to MongoDB (no need to include useNewUrlParser and useUnifiedTopology)
    mongoose.connect('mongodb://127.0.0.1:27017/mydatabase')
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Could not connect to MongoDB', err));
};

module.exports = { connectToDatabase };
