const nodemailer = require('nodemailer');
const { Worker } = require('worker_threads');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

// Function to send email using a worker thread
function sendEmail(email) {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./worker.js', { workerData: email });
        worker.on('message', resolve);
        worker.on('error', reject);
    });
}

module.exports = { sendEmail };