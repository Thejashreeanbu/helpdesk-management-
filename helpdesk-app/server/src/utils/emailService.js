import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

// Create a transporter
let transporter;

if (process.env.EMAIL_SERVICE === 'gmail') {
    // configured for Gmail
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
} else {
    // For development/fallback, use Ethereal or just a dummy one that logs to console
    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'ethereal.user@example.com', // Replace with real Ethereal creds if needed
            pass: 'ethereal_pass'
        }
    });
}

export const sendEmail = async ({ to, subject, html }) => {
    try {
        console.log(`[Email Service] Attempting to send email to: ${to}`);
        console.log(`[Email Service] Subject: ${subject}`);

        // Mock sending by default if no real credentials are set
        if (!process.env.EMAIL_USER && !process.env.ETHEREAL_USER) {
            console.log('---------------------------------------------------');
            console.log('[MOCK EMAIL CONTENT]');
            console.log(html);
            console.log('---------------------------------------------------');
            return { messageId: 'mock-id' };
        }

        const info = await transporter.sendMail({
            from: `"Helpdesk Support" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
