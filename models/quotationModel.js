
const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
    quotationId: { type: String, required: true, unique: true },
    policyDetails: { type: Object, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation;
