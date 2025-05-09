const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();
const path = require('path'); 

// Determine the project's backend root directory 
const backendDir = process.cwd();

// Construct the path to the data directory
const dataDir = path.join(backendDir, 'data');
const defaultDbPath = path.join(dataDir, 'library.db');

const DBSOURCE = process.env.DATABASE_URL ? path.join(backendDir, process.env.DATABASE_URL) : defaultDbPath;

const db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      console.error(`Error opening database at ${DBSOURCE}`, err.message, err);
      throw err;
    } else {
        db.exec(`CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            genre TEXT NOT NULL,
            summary TEXT,
            publishedYear INTEGER,
            coverImageUrl TEXT
        );

        CREATE INDEX IF NOT EXISTS idx_genre ON books (genre);
        CREATE INDEX IF NOT EXISTS idx_author ON books (author);
        CREATE INDEX IF NOT EXISTS idx_published_year ON books (publishedYear);
        `, (errExec) => { 
            if (errExec) {
                console.error("Error creating table or indexes", errExec.message);
            } else {
                console.log("Table 'books' and indexes are ready.");
            }
        });
    }
});

module.exports = db;