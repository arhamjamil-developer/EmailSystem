const request = require('supertest');
const mongoose = require('mongoose');
const app = require('./server'); // Adjust the path based on your server file location.
const { Email } = require('../emailModel'); // Adjust the path based on your model location.



describe('Email System Test Cases', () => {
    let testEmailId;

    test('API Health Check', async () => {
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('healthy');
    });

    test('Add Email to Queue', async () => {
        const emailData = {
            to: 'recipient@example.com',
            from: 'sender@example.com',
            subject: 'Test Email',
            body: 'This is a test email.',
        };
        const response = await request(app).post('/api/emails').send(emailData);
        expect(response.status).toBe(202);
        expect(response.body.message).toBe('Email queued for processing');
    });

    test('Retrieve Emails with Pagination', async () => {
        const response = await request(app).get('/api/emails?page=1&limit=1');
        expect(response.status).toBe(200);
        expect(response.body.emails.length).toBeGreaterThanOrEqual(1);
    });

    test('Get Specific Email by ID', async () => {
        // Create a test email
        const email = new Email({
            to: 'test@example.com',
            from: 'sender@example.com',
            subject: 'Specific Email Test',
            body: 'Testing specific email retrieval.',
        });
        await email.save();
        testEmailId = email._id;

        const response = await request(app).get(`/api/emails/${testEmailId}`);
        expect(response.status).toBe(200);
        expect(response.body.subject).toBe('Specific Email Test');
    });

    test('Delete Email by ID', async () => {
        const response = await request(app).delete(`/api/emails/${testEmailId}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Email deleted successfully');
    });

    test('Handle Non-existent Email Retrieval', async () => {
        const response = await request(app).get('/api/emails/64b77c6c5834de02b9d11b33'); // Invalid ObjectID format
        expect(response.status).toBe(500);
        expect(response.body.error).toBeDefined();
    });
});
