# Open Library Explorer

A full-stack application to browse and explore a catalog of books. This project allows users to view a paginated list of books, filter them by genre, author, and published year, and view detailed information for each book.

**Live Demo URL:** (If hosted, add URL here)

## Tech Stack

**Backend:**
* Node.js
* Express.js
* SQLite3
* CORS, dotenv

**Frontend:**
* React (with Vite)
* Axios
* CSS3

## Features Implemented

* **Backend:**
    * RESTful API for books and genres.
    * Pagination for book listings (`page`, `limit`).
    * Filtering by genre, author, and published year.
    * SQLite database for persistent storage.
    * Database indexing on filterable fields for efficiency.
    * Seed script for populating the database.
* **Frontend:**
    * Responsive interface for Browse books.
    * Display list of books with "Load More" button (client-side lazy loading of pages).
    * Filters for genre, author, and published year.
    * Loading state/spinner when fetching data.
    * Modal display for detailed book information.
    * Placeholder images for books without cover URLs.

## Setup and Run Instructions

### Prerequisites

* Node.js (v18.x or later recommended)
* npm (comes with Node.js)

### Backend Setup

1.  **Clone Repository:**
    ```bash
    git clone <your-repo-url>
    cd open-library-explorer
    ```
2.  **Navigate to Backend Directory:**
    ```bash
    cd backend
    ```
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
4.  **Environment Variables:**
    Create a `.env` file in the `backend` directory by copying `.env.example`:
    ```bash
    cp .env.example .env
    ```
    (Modify `DATABASE_URL` or `PORT` if necessary, though defaults should work.)

5.  **Database Seeding:**
    This command will create the `library.db` file in the `backend/data` directory and populate it with sample books.
    ```bash
    npm run seed
    ```
    *Note: To add more books, edit `backend/src/seedDatabase.js` or replace it with a script that loads data from a CSV/JSON file.*

6.  **Start Backend Server:**
    ```bash
    npm run dev
    ```
    The backend API will be running on `http://localhost:3001` (or the port specified in `.env`).

### Frontend Setup

1.  **Navigate to Frontend Directory:**
    (From the project root)
    ```bash
    cd frontend
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Create a `.env` file in the `frontend` directory by copying `.env.example`:
    ```bash
    cp .env.example .env
    ```
    Ensure `VITE_API_BASE_URL` points to your running backend (default is `http://localhost:3001/api`).

4.  **Start Frontend Development Server:**
    ```bash
    npm run dev
    ```
    The frontend application will be accessible at `http://localhost:5173` (or another port if 5173 is busy).

## API Documentation

All API endpoints are prefixed with `/api`.

* **`GET /books`**: Returns a paginated list of books.
    * **Query Parameters:**
        * `page` (integer, default: 1): The page number to retrieve.
        * `limit` (integer, default: 10): The number of books per page.
        * `genre` (string, optional): Filter books by genre.
        * `author` (string, optional): Filter books by author (partial match).
        * `publishedYear` (integer, optional): Filter books by published year.
    * **Success Response (200 OK):**
        ```json
        {
            "data": [
                {
                    "id": 1,
                    "title": "The Great Gatsby",
                    "author": "F. Scott Fitzgerald",
                    "genre": "Classic",
                    "summary": "A story of wealth, love, and the American Dream.",
                    "publishedYear": 1925,
                    "coverImageUrl": "[https://example.com/gatsby.jpg](https://example.com/gatsby.jpg)"
                }
                // ... more books
            ],
            "currentPage": 1,
            "totalPages": 50,
            "totalItems": 500,
            "limit": 10
        }
        ```
    * **Error Response (500 Internal Server Error):**
        ```json
        {
            "message": "Error retrieving books",
            "error": "Details of the error"
        }
        ```

* **`GET /books/:id`**: Returns detailed metadata for a specific book.
    * **Path Parameter:**
        * `id` (integer): The unique ID of the book.
    * **Success Response (200 OK):**
        ```json
        {
            "id": 1,
            "title": "The Great Gatsby",
            // ... other book fields
        }
        ```
    * **Error Response (404 Not Found):**
        ```json
        { "message": "Book not found" }
        ```
    * **Error Response (500 Internal Server Error):**
        ```json
        { "message": "Error retrieving book", "error": "..." }
        ```

* **`GET /genres`**: Returns a list of all available unique genres.
    * **Success Response (200 OK):**
        ```json
        [ "Classic", "Dystopian", "Fantasy", "Non-Fiction", "Romance", "Science Fiction" ]
        ```
    * **Error Response (500 Internal Server Error):**
        ```json
        { "message": "Error retrieving genres", "error": "..." }
        ```

## System Design Explanation

### Data Modeling

* A single primary entity: `Book`.
* **Book Schema:**
    * `id`: INTEGER, Primary Key, Auto-incrementing
    * `title`: TEXT, Not Null
    * `author`: TEXT, Not Null
    * `genre`: TEXT, Not Null
    * `summary`: TEXT
    * `publishedYear`: INTEGER
    * `coverImageUrl`: TEXT (Optional)
* **Database:** SQLite is used for its simplicity and file-based nature, suitable for this project's scale.
* **Relationships:** For this iteration, `author` and `genre` are stored as simple text fields. For a more complex system, these could be normalized into separate tables (e.g., `Authors`, `Genres`, `BookAuthors_JunctionTable`).

### API Structure

* The API follows RESTful principles.
* Endpoints are designed to be intuitive and resource-oriented.
* Standard HTTP methods (`GET`) are used.
* Clear separation of concerns:
    * `routes/` define the API paths and link to controllers.
    * `controllers/` handle incoming requests, interact with models, and formulate responses.
    * `models/` (or in this case, `bookModel.js`) encapsulate the database interaction logic.

### Backend Design Decisions and Trade-offs

* **Database Choice (SQLite):**
    * **Pros:** Easy setup, no separate server process needed, good for development and small to medium datasets. Sufficient for the assignment's scope.
    * **Cons:** Not ideal for high-concurrency production environments or very large-scale applications. Lacks some advanced features of server-based RDBMS like PostgreSQL or MySQL.
* **Filtering and Pagination:**
    * Implemented at the database level using SQL `LIMIT`, `OFFSET`, and `WHERE` clauses. This is efficient as it only retrieves necessary data.
    * Indexes are created on `genre`, `author`, and `publishedYear` to speed up queries involving these filters.
* **Seeding:** A JavaScript seeder (`seedDatabase.js`) is provided. For larger datasets (500-1000 books), this script would ideally parse a CSV or JSON file. The current sample data and generator are for demonstration.
* **Error Handling:** Basic error handling is in place. For a production app, more structured error responses and logging would be implemented.
* **No ORM:** Direct SQL queries are used with the `sqlite3` library for simplicity and direct control. An ORM like Sequelize or TypeORM could be used for more complex data models or to abstract SQL, but adds another layer of complexity.

### Frontend Design Decisions and Trade-offs

* **Framework (React with Vite):**
    * **Pros:** Component-based architecture promotes reusability and maintainability. Large ecosystem. Vite provides a fast development experience.
    * **Cons:** Can have a steeper learning curve for those new to it. State management can become complex for larger apps (though for this scale, `useState` and `useCallback` are sufficient).
* **Lazy Loading ("Load More" Button):**
    * Client-side pagination is managed by requesting new pages of data from the backend as the user clicks "Load More".
    * **Alternative (Infinite Scroll):** Could be implemented using `IntersectionObserver API` for a more seamless experience, but "Load More" is simpler to implement robustly.
* **State Management:** Primarily uses React's built-in `useState` and `useEffect` hooks. For a larger application, Context API or a dedicated state management library (Redux, Zustand) might be considered.
* **Styling:** Plain CSS with per-component CSS files. CSS Modules or styled-components could be used for more scoped styling.
* **Responsiveness:** Achieved using Flexbox, CSS Grid (implicitly through layout), and media queries for adapting to different screen sizes.

### Performance Considerations

* **Backend:**
    * Database indexing is key for filter performance.
    * Pagination prevents sending large datasets over the network.
* **Frontend:**
    * "Load More" functionality prevents a large initial data load, improving perceived performance.
    * Code splitting (default with Vite) helps reduce initial bundle size.
    * Memoization (e.g., `React.memo`, `useCallback`) can be used for optimizing component re-renders if performance bottlenecks are identified, but are not heavily used in this skeleton to keep it simpler.

## Optional Enhancements (Ideas for Future)

* Implement debounced search functionality.
* Add sorting options (by title, year, author).
* Use skeleton loaders for a better loading UX.
* Implement actual infinite scroll.
* User authentication and user-specific lists (beyond scope).
* More advanced filtering combinations.
* Host the application (e.g., Vercel for frontend, Railway/Render for backend).

---