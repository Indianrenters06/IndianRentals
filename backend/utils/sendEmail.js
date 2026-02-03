const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const { email, subject, message, html } = options;

    if (!email || !subject) {
        throw new Error("Email and subject are required");
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email credentials missing");
    }

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp-relay.brevo.com",
        port: Number(process.env.EMAIL_PORT) || 2525, // Fallback to 2525 if not set
        secure: false, // true for 465, false for 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : "",
        },
        connectionTimeout: 10000,
        greetingTimeout: 5000,
    });

    const mailOptions = {
        from: `"IndianRentals" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: email,
        subject,
        text: message,
        html,
    };

    // Race condition: Timeout after 5 seconds to prevent UI hanging
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Email request timed out')), 5000)
    );

    await Promise.race([
        transporter.sendMail(mailOptions),
        timeout
    ]);
};

module.exports = sendEmail;
