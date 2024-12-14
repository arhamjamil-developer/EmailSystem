const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/email-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Email schema
const emailSchema = new mongoose.Schema({
    to: String,
    from: String,
    subject: String,
    body: String,
    sentAt: { type: Date, default: Date.now }
});

// Check if the model already exists
const Email = mongoose.models.Email || mongoose.model('Email', emailSchema);

module.exports = { Email };