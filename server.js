require('dotenv').config(); // উপরে রাখতে হবে

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');  

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // .env থেকে ইমেইল
        pass: process.env.EMAIL_PASS  // .env থেকে অ্যাপ পাসওয়ার্ড
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/send', (req, res) => {
    const { name, email,location, message } = req.body;

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER, // তোমার ইমেইলে যাবে
        subject: `hey I happy to contact with you`,
        text: `my name id ${name} .I am from ${location} \n ${message}`,
        replyTo:email
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending message.');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Message sent successfully!');
        }
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
