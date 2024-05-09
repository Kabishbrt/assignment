// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/userController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Save uploaded files to the uploads folder
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // Rename file with original name
    }
});

// Create multer instance
const upload = multer({ storage: storage });

// User login
router.post('/login',userController.login);


router.post('/signup',upload.none(), userController.signup);
module.exports = router;
