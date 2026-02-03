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
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS.trim(),
        },
    });

    await transporter.sendMail({
        from: `"IndianRentals" <${process.env.EMAIL_USER}>`,
        to: email,
        subject,
        text: message,
        html,
    });
};

module.exports = sendEmail;
