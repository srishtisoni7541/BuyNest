const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true", 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.verify(function (error, success) {
  if (error) {
    console.error(" Email server connection failed:", error);
  } else {
    console.log(" Email server is ready to send messages");
  }
});

module.exports = transporter;