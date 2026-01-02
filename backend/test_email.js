const dotenv = require('dotenv');
dotenv.config(); // Load env vars first
const sendEmail = require('./utils/sendEmail');

const testEmailSending = async () => {
    console.log('--- TESTING EMAIL SENDING ---');
    console.log('User:', process.env.EMAIL_USER);
    // Don't log the password

    try {
        await sendEmail({
            email: process.env.EMAIL_USER, // Send to self
            subject: 'IndianRentals Test Email',
            message: 'If you are reading this, your email configuration is working perfectly! 🚀',
        });
        console.log('✅ Email sent successfully!');
    } catch (error) {
        console.error('❌ Email failed:', error);
    }
};

testEmailSending();
