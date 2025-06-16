const nodemailer = require('nodemailer');
require('dotenv').config(); // To keep sensitive info in .env

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.OUTLOOK_EMAIL,       // e.g., brewurichard95@outlook.com
    pass: process.env.OUTLOOK_APP_PASSWORD // app password, not your real one
  }
});
