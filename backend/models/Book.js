// models/Book.js

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the User model, assuming you have one
    }
    // Add other properties as needed
});

module.exports = mongoose.model('Book', bookSchema);
