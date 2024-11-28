const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { 
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS 
        },
    });

    const verificationUrl = `http://localhost:3000/verify-email/${token}`; // Update with your frontend URL

    const mailOptions = {
        from: 'noreply@example.com',
        to: email,
        subject: 'Verify your email',
        html: `<p>Please verify your email by clicking the link below:</p><a href="${verificationUrl}">Verify Email</a>`,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
