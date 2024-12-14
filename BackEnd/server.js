// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Worker } = require('worker_threads');

// Import Email model - update the path to where your model file is
const Email = require('./emailModel');

const app = express();

// Middleware
app.use(cors());  // Enable CORS for frontend communication
app.use(express.json());

// Connect to MongoDB with connection pooling
mongoose.connect('mongodb://localhost:27017/email-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10  // Connection pool for better concurrent performance
});

// Message queue for handling concurrent requests
const messageQueue = [];
const MAX_WORKERS = 4;  // Maximum concurrent workers
let activeWorkers = 0;

// Non-blocking message processor
const processMessageQueue = async () => {
    // Don't start new processing if max workers reached or queue is empty
    if (activeWorkers >= MAX_WORKERS || messageQueue.length === 0) return;
    
    activeWorkers++;
    const message = messageQueue.shift();
    
    try {
        // Create and save email in a non-blocking way
        const email = new Email(message);
        await email.save();
        
        // Process more messages if available
        activeWorkers--;
        if (messageQueue.length > 0) {
            processMessageQueue();
        }
    } catch (error) {
        console.error('Error processing message:', error);
        activeWorkers--;
    }
};

// API Routes
app.post('/api/emails', async (req, res) => {
    try {
        const { to, from, subject, body } = req.body;
        
        // Add message to processing queue
        messageQueue.push({ to, from, subject, body });
        
        // Start processing if workers available
        processMessageQueue();
        
        res.status(202).json({ 
            message: 'Email queued for processing',
            queuePosition: messageQueue.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all emails - with pagination and sorting
app.get('/api/emails', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const emails = await Email.find()
            .sort({ sentAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()  // Convert to plain JavaScript objects for better performance
            .exec();
            
        const total = await Email.countDocuments();
            
        res.json({
            emails,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalEmails: total
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single email by ID
app.get('/api/emails/:id', async (req, res) => {
    try {
        const email = await Email.findById(req.params.id);
        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }
        res.json(email);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete an email
app.delete('/api/emails/:id', async (req, res) => {
    try {
        const email = await Email.findByIdAndDelete(req.params.id);
        if (!email) {
            return res.status(404).json({ message: 'Email not found' });
        }
        res.json({ message: 'Email deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        queueLength: messageQueue.length,
        activeWorkers,
        mongoConnection: mongoose.connection.readyState === 1
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});