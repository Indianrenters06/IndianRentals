const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // For development/mocking if no credentials
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`[MOCK EMAIL] To: ${options.email}, Subject: ${options.subject}, Text: ${options.message}`);
        return;
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports. 587 is STARTTLS
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `IndianRentals <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html, // Optional HTML support
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
