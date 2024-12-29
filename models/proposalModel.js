const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    proposalNo: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    proposalDetails: { type: Object, required: true },
    proposalStatus: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Proposal Application', applicationSchema);

module.exports = Application;
