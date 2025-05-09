import React, { useState, useEffect, useCallback } from 'react';
import { fetchBooks, fetchBookById } from '../api/bookService';
import BookList from '../components/BookList';
import LoadingSpinner from '../components/LoadingSpinner';
import LoadMoreButton from '../components/LoadMoreButton';
import Filters from '../components/Filters';
import BookDetail from '../components/BookDetail';
import './HomePage.css';

const ITEMS_PER_PAGE = 12; // Number of books to load per page

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [selectedBookDetail, setSelectedBookDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentFilters, setCurrentFilters] = useState({
    genre: '',
    author: '',
    publishedYear: ''
  });

  const loadBooks = useCallback(async (page, filters, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const data = await fetchBooks(page, ITEMS_PER_PAGE, filters);
      setBooks(prevBooks => append ? [...prevBooks, ...data.data] : data.data);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to load books:", error);
      // You could set an error state here to display to the user
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadBooks(1, currentFilters); // Load initial books
  }, [loadBooks, currentFilters]); // Rerun when filters change

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      loadBooks(currentPage + 1, currentFilters, true);
    }
  };

  const handleFilterChange = (newFilters) => {
    setBooks([]); // Clear current books
    setCurrentPage(1); // Reset to first page
    setCurrentFilters(newFilters);
    // The useEffect will pick up currentFilters change and reload
  };

  const handleSelectBook = async (bookId) => {
    setIsLoading(true);
    try {
      const bookData = await fetchBookById(bookId);
      setSelectedBookDetail(bookData);
    } catch (error) {
      console.error("Failed to fetch book details", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setSelectedBookDetail(null);
  };

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Open Library Explorer</h1>
      </header>
      <Filters onFilterChange={handleFilterChange} currentFilters={currentFilters} />

      {isLoading && books.length === 0 ? ( // Show main loader only if no books are displayed yet
        <LoadingSpinner />
      ) : (
        <>
          <BookList books={books} onSelectBook={handleSelectBook} />
          {(isLoadingMore) && <LoadingSpinner />}
          {!isLoading && books.length > 0 && (
             <LoadMoreButton
                onClick={handleLoadMore}
                disabled={isLoadingMore || currentPage >= totalPages}
                hasMore={currentPage < totalPages}
            />
          )}
        </>
      )}
      {selectedBookDetail && <BookDetail book={selectedBookDetail} onClose={handleCloseDetail} />}
    </div>
  );
};

export default HomePage;