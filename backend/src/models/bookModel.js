const db = require('../database');

const Book = {
    findAll: ({ page = 1, limit = 10, genre, author, publishedYear }, callback) => {
        let query = "SELECT * FROM books WHERE 1=1";
        const params = [];
        const queryParams = []; // For counting total items with filters

        if (genre) {
            query += " AND genre = ?";
            params.push(genre);
            queryParams.push(genre);
        }
        if (author) {
            query += " AND author LIKE ?"; // Use LIKE for partial matches
            params.push(`%${author}%`);
            queryParams.push(`%${author}%`);
        }
        if (publishedYear) {
            query += " AND publishedYear = ?";
            params.push(publishedYear);
            queryParams.push(publishedYear);
        }

        // Count total items with filters
        let countQuery = "SELECT COUNT(*) as count FROM books WHERE 1=1";
        if (genre) countQuery += " AND genre = ?";
        if (author) countQuery += " AND author LIKE ?";
        if (publishedYear) countQuery += " AND publishedYear = ?";

        db.get(countQuery, queryParams, (err, row) => {
            if (err) {
                return callback(err);
            }
            const totalItems = row.count;
            const totalPages = Math.ceil(totalItems / limit);

            const offset = (page - 1) * limit;
            query += " ORDER BY title ASC LIMIT ? OFFSET ?"; // Example sorting
            params.push(limit, offset);

            db.all(query, params, (err, rows) => {
                if (err) {
                    return callback(err);
                }
                callback(null, {
                    data: rows,
                    currentPage: parseInt(page),
                    totalPages: totalPages,
                    totalItems: totalItems,
                    limit: parseInt(limit)
                });
            });
        });
    },

    findById: (id, callback) => {
        const query = "SELECT * FROM books WHERE id = ?";
        db.get(query, [id], callback);
    },

    findAllGenres: (callback) => {
        const query = "SELECT DISTINCT genre FROM books ORDER BY genre ASC";
        db.all(query, [], (err, rows) => {
            if (err) {
                return callback(err);
            }
            callback(null, rows.map(r => r.genre));
        });
    },

    // Add this function to be used by the seeder
    create: (book, callback) => {
        const { title, author, genre, summary, publishedYear, coverImageUrl } = book;
        const query = `INSERT INTO books (title, author, genre, summary, publishedYear, coverImageUrl)
                       VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(query, [title, author, genre, summary, publishedYear, coverImageUrl], function(err) {
            // 'this' refers to the statement object, 'this.lastID' is the ID of the last inserted row
            callback(err, { id: this ? this.lastID : null });
        });
    }
};

module.exports = Book;