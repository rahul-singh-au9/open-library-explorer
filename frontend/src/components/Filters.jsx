import React, { useState, useEffect } from 'react';
import { fetchGenres } from '../api/bookService';
import './Filters.css';

const Filters = ({ onFilterChange, currentFilters }) => {
  const [genres, setGenres] = useState([]);
  const [author, setAuthor] = useState(currentFilters.author || '');
  const [selectedGenre, setSelectedGenre] = useState(currentFilters.genre || '');
  const [year, setYear] = useState(currentFilters.publishedYear || '');

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const fetchedGenres = await fetchGenres();
        setGenres(fetchedGenres);
      } catch (error) {
        console.error("Failed to load genres", error);
      }
    };
    loadGenres();
  }, []);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    onFilterChange({ genre: selectedGenre, author, publishedYear: year });
  };

  const handleResetFilters = () => {
    setAuthor('');
    setSelectedGenre('');
    setYear('');
    onFilterChange({ genre: '', author: '', publishedYear: '' });
  };

  return (
    <form className="filters-form" onSubmit={handleApplyFilters}>
      <div className="filter-group">
        <label htmlFor="genre-filter">Genre:</label>
        <select
          id="genre-filter"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="author-filter">Author:</label>
        <input
          type="text"
          id="author-filter"
          placeholder="Filter by author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="year-filter">Published Year:</label>
        <input
          type="number"
          id="year-filter"
          placeholder="e.g., 1995"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
      </div>
      <div className="filter-buttons">
        <button type="submit">Apply Filters</button>
        <button type="button" onClick={handleResetFilters}>Reset Filters</button>
      </div>
    </form>
  );
};

export default Filters;