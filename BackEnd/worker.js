const { parentPort, workerData } = require('worker_threads');
const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

// Send the email
async function sendEmail(email) {
    try {
        await transporter.sendMail({
            from: email.from,
            to: email.to,
            subject: email.subject,
            text: email.body,
        });
        parentPort.postMessage(`Email sent to: ${email.to}`);
    } catch (error) {
        parentPort.postMessage(`Error sending email: ${error.message}`);
    }
}

// Execute the sendEmail function
sendEmail(workerData);