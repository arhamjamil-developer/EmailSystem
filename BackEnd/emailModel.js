// emailModel.js
const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    to: {
        type: String,
        required: true,
        trim: true
    },
    from: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['queued', 'processing', 'sent', 'failed'],
        default: 'queued'
    },
    retryCount: {
        type: Number,
        default: 0
    }
});

// Index for faster queries
emailSchema.index({ sentAt: -1 });
emailSchema.index({ status: 1 });

module.exports = mongoose.model('Email', emailSchema);