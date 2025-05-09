import React from 'react';
import './BookCard.css'; // Create this CSS file

const BookCard = ({ book, onSelectBook }) => {
  const coverImage = book.coverImageUrl || `https://via.placeholder.com/150x220.png?text=${encodeURIComponent(book.title)}`;
  return (
    <div className="book-card" onClick={() => onSelectBook(book.id)}>
      <img src={coverImage} alt={`Cover of ${book.title}`} className="book-card-image" />
      <h3 className="book-card-title">{book.title}</h3>
      <p className="book-card-author">By: {book.author}</p>
      <p className="book-card-genre">Genre: {book.genre}</p>
      <p className="book-card-year">Year: {book.publishedYear}</p>
    </div>
  );
};

export default BookCard;