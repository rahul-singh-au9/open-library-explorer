import React from 'react';
import BookCard from './BookCard';
import './BookList.css';

const BookList = ({ books, onSelectBook }) => {
  if (!books || books.length === 0) {
    return <p className="no-books-found">No books found matching your criteria.</p>;
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onSelectBook={onSelectBook} />
      ))}
    </div>
  );
};

export default BookList;