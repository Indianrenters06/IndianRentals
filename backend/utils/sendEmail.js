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
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: false, // true for 465, false for 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.trim() : "",
        },
    });

    await transporter.sendMail({
        from: `"IndianRentals" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: email,
        subject,
        text: message,
        html,
    });
};

module.exports = sendEmail;
