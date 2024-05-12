const Book = require('../models/Book');

exports.getAllBooks = async (req, res) => {
    try {
        // Find all books and populate the 'userId' field with 'username' and 'email'
        const books = await Book.find().populate({
            path: 'userId',
            select: 'username email' // Specify the fields you want to populate
        });

        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBooksByUserId = async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from request parameters

        // Find books by the provided user ID and populate the 'userId' field with 'username' and 'email'
        const books = await Book.find({ userId });
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createBook = async (req, res) => {
    

    // Check if image was uploaded
    if (!req.file) {
        return res.status(400).json({ message: 'Image file is required' });
    }

    const title = req.body.title;
    const author = req.body.author;
    const condition = req.body.condition;
    const userId = req.body.userId;


    const imageUrl = `${req.protocol}s://${req.get('host')}/uploads/${req.file.filename}`;
    console.log(imageUrl)
    const book = new Book({
        title,
        author,
        condition,
        image: imageUrl,
        userId 
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateBook = async (req, res) => {
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
};

exports.deleteBook = async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
