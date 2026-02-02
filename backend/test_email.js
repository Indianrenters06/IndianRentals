require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async () => {
    console.log('Testing email sending...');
    console.log('User:', process.env.EMAIL_USER);
    // Don't log password

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `IndianRentals <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to self
            subject: 'Test Email form IndianRentals Debug',
            text: 'This is a test email to verify credentials.',
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
    } catch (error) {
        console.error('Email send failed:', error);
    }
};

sendEmail();
