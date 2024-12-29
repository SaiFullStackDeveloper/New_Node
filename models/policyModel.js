const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    policyNo: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    policyDetails: { type: Object, required: true },
    policyStatus: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Application = mongoose.model('Policy Issuance', policySchema);

module.exports = Application;
