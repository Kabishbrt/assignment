// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bookroute = require('./routes/bookRoutes');
const userroute = require('./routes/userRoutes');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://assignment:start@cluster0.ob3tf0p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    const { useremail, subject, body } = req.body;

    // Check if all required fields are provided
    if (!useremail || !subject || !body) {
        return res.status(400).json({ error: "User emails, subject, and body are required" });
    }

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
        to: useremail, // Convert array to comma-separated string
        subject: subject,
        text: body // Set the email body text
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
