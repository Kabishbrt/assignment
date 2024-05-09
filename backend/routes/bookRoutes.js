// routes/bookRoutes.js

const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const multer = require('multer');
const path = require('path');

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


// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new book
router.post('/', upload.single('image'), async (req, res) => {
    const { title, author, condition } = req.body;

    // Check if image was uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'Image file is required' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    console.log(imageUrl)
    const book = new Book({
        title,
        author,
        condition,
        image: imageUrl // Save the file path to the database
        // Add other properties as needed
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a book
router.put('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        // Update book properties
        if (req.body.title) {
            book.title = req.body.title;
        }
        if (req.body.author) {
            book.author = req.body.author;
        }
        if (req.body.condition) {
            book.condition = req.body.condition;
        }
        // Save updated book
        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a book
router.delete('/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
