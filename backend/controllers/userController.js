const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signup = async (req, res) => {
    try {
        const { username, email, password, city, street } = req.body;
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            city,
            street
        });

        // Save new user to the database
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, 'bookswap');
        
        // Return token to client
        res.status(201).json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, 'bookswap');
        
        // Return token to client
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { login, signup };