const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');
require('dotenv').config();
const db = require('./database'); // Ensures DB connection is made and table is created

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

app.use('/api', bookRoutes); // Prefix all book routes with /api

// Simple root route
app.get('/', (req, res) => {
    res.send('Open Library Explorer API');
});

// Basic error handling (can be improved)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;