// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bookroute = require('./routes/bookRoutes');
const userroute = require('./routes/userRoutes');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://kabishbrt:kabish@cluster0.m18ffxe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/books', bookroute);
app.use('/api/users',userroute);

const EMAIL = "replyinfoclick@gmail.com";
const PASSWORD ="oplc naqf woiz quic";
app.post('/api/mail', (req, res) => {
    const { userEmails, subject, body } = req.body;

    // Check if all required fields are provided
    if (!userEmails || !subject || !body) {
        return res.status(400).json({ error: "User emails, subject, and body are required" });
    }

    // Convert userEmails to array if it's not already
    const recipients = Array.isArray(userEmails) ? userEmails : [userEmails];

    // Configure Nodemailer transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    });

    // Construct email message
    let message = {
        from: EMAIL,
        to: recipients.join(','), // Convert array to comma-separated string
        subject: subject,
        html: body // Set the email body text
    };

    // Send email
    transporter.sendMail(message)
        .then(() => {
            return res.status(201).json({
                msg: "Email sent successfully"
            });
        })
        .catch(error => {
            return res.status(500).json({ error });
        });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
