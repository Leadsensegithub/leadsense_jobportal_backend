const nodemailer = require('nodemailer');

const path = require('path');

// Read the HTML file

// Create a transporter object using Office 365 SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // True for 465, false for other ports
    auth: {
        user: '123admissions.ls@gmail.com', // Your Office 365 email address
        pass: 'gcehwnoanfsiawrh', // Your app-specific password
    },
    tls: {
        rejectUnauthorized: false // For self-signed certificates; remove if not needed
    }
});


// Function to send an email
const sendMail = async (to, username, otp, email, type) => {
    try {
        const mailOptions = {
            from: 'iop.support@liba.edu', // Your Office 365 email address
            to: to,
            subject: 'Your OTP Code',
            text: `Dear ${username},\n\nYour OTP code is ${otp}.\n\nBest Regards,\nThe Support Team`,
          
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log('Error:', error);
            }
            console.log('Message sent: %s', info.messageId);
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendMail;
