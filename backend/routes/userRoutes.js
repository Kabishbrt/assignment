// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userController = require('../controllers/userController');

// User login
router.post('/login',userController.login);


router.post('/signup', userController.signup);
router.get('/:id', userController.getUserDetailsById);
module.exports = router;
