const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Function to send verification email
const sendVerificationEmail = async (existingUser) => {
  const token = jwt.sign(
    { id: existingUser._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY_TIME }
  );

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,     
      pass: process.env.MAIL_PASS     
    }
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: existingUser.email,
    subject: 'Verify your Email',
    html: `
      <h2>Welcome, ${existingUser.username}!</h2>
      <p>Please click the link below to verify your email:</p>
      <a href="http://localhost:3000/api/verify-email/${token}">Verify Email</a>
      <p>This link will expire soon.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };

