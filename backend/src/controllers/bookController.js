const Book = require('../models/bookModel');

exports.getAllBooks = (req, res) => {
    const { page = 1, limit = 10, genre, author, publishedYear } = req.query;
    Book.findAll({ page, limit, genre, author, publishedYear }, (err, booksData) => {
        if (err) {
            res.status(500).json({ message: "Error retrieving books", error: err.message });
            return;
        }
        res.json(booksData);
    });
};

exports.getBookById = (req, res) => {
    const { id } = req.params;
    Book.findById(id, (err, book) => {
        if (err) {
            res.status(500).json({ message: "Error retrieving book", error: err.message });
            return;
        }
        if (!book) {
            res.status(404).json({ message: "Book not found" });
            return;
        }
        res.json(book);
    });
};

exports.getAllGenres = (req, res) => {
    Book.findAllGenres((err, genres) => {
        if (err) {
            res.status(500).json({ message: "Error retrieving genres", error: err.message });
            return;
        }
        res.json(genres);
    });
};