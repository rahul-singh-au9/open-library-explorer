const db = require('./database'); // Establishes connection and ensures table exists
const Book = require('./models/bookModel'); // We'll use the create method from the model

const sampleBooks = [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", summary: "A story of wealth, love, and the American Dream.", publishedYear: 1925, coverImageUrl: "https://example.com/gatsby.jpg" },
    { title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Classic", summary: "A novel about injustice and childhood innocence.", publishedYear: 1960, coverImageUrl: "https://example.com/mockingbird.jpg" },
    { title: "1984", author: "George Orwell", genre: "Dystopian", summary: "A terrifying vision of a totalitarian future.", publishedYear: 1949, coverImageUrl: "https://example.com/1984.jpg" },
    { title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", summary: "A classic romance novel.", publishedYear: 1813, coverImageUrl: "https://example.com/pride.jpg" },
    { title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", summary: "The adventure of Bilbo Baggins.", publishedYear: 1937, coverImageUrl: "https://example.com/hobbit.jpg" },
    { title: "Brave New World", author: "Aldous Huxley", genre: "Dystopian", summary: "A futuristic society driven by technology and conformity.", publishedYear: 1932 },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", genre: "Coming-of-Age", summary: "A few days in the life of Holden Caulfield.", publishedYear: 1951 },
    { title: "The Lord of the Rings", author: "J.R.R. Tolkien", genre: "Fantasy", summary: "An epic fantasy adventure to destroy the One Ring.", publishedYear: 1954 },
    { title: "Jane Eyre", author: "Charlotte Brontë", genre: "Gothic", summary: "The story of a young governess.", publishedYear: 1847 },
    { title: "Wuthering Heights", author: "Emily Brontë", genre: "Gothic", summary: "A passionate and tragic love story on the Yorkshire moors.", publishedYear: 1847 },
    // Add many more books here (aim for 500-1000)
    // Example of a book with a different genre to test filtering
    { title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", genre: "Non-Fiction", summary: "An exploration of human history.", publishedYear: 2011 },
    { title: "Dune", author: "Frank Herbert", genre: "Science Fiction", summary: "Politics, religion, ecology, and human evolution on a desert planet.", publishedYear: 1965 },
    { title: "Foundation", author: "Isaac Asimov", genre: "Science Fiction", summary: "A vast empire collapses, and a new society arises.", publishedYear: 1951 },
];

// Function to generate more books if needed (using a simple pattern here)
function generateMoreBooks(count) {
    const moreBooks = [];
    const genres = ["Fantasy", "Science Fiction", "Mystery", "Thriller", "Historical Fiction", "Contemporary", "Non-Fiction"];
    const authors = ["Author A", "Author B", "Author C", "Author D", "Author E"];
    for (let i = 0; i < count; i++) {
        moreBooks.push({
            title: `Generated Book Title ${i + 1}`,
            author: authors[i % authors.length],
            genre: genres[i % genres.length],
            summary: `This is a summary for generated book ${i + 1}. It has an interesting plot and characters.`,
            publishedYear: 1950 + (i % 70), // Years from 1950 to 2019
            coverImageUrl: `https://picsum.photos/seed/${i+100}/200/300` // Placeholder images
        });
    }
    return moreBooks;
}

const allBooksToSeed = [...sampleBooks, ...generateMoreBooks(490)]; // Generate 490 more to reach ~500

let booksProcessed = 0;
console.log(`Starting to seed ${allBooksToSeed.length} books...`);

db.serialize(() => { // Use serialize to ensure statements run in order
    // Clear existing books (optional, be careful with this in production)
    // db.run("DELETE FROM books", (err) => {
    //     if (err) return console.error("Error deleting existing books", err.message);
    //     console.log("Existing books deleted.");
    // });
    // db.run("UPDATE sqlite_sequence SET seq = 0 WHERE name = 'books';", (err) => {
    //      if (err) return console.error("Error resetting sequence", err.message);
    //      console.log("Book ID sequence reset.");
    // });


    allBooksToSeed.forEach((book) => {
        Book.create(book, (err, newBook) => {
            booksProcessed++;
            if (err) {
                console.error(`Error inserting book "${book.title}":`, err.message);
            } else {
                // console.log(`Inserted book "${book.title}" with ID ${newBook.id}`);
            }
            if (booksProcessed === allBooksToSeed.length) {
                console.log(`${booksProcessed} books processed. Seeding complete.`);
                db.close((err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log('Closed the database connection.');
                });
            }
        });
    });
});

// Note: For a very large number of inserts, consider batching them or using transactions
// for better performance if your SQLite driver supports it well or if you switch to a different DB.