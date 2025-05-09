import React from 'react';
import './BookDetail.css';

const BookDetail = ({ book, onClose }) => {
  if (!book) return null;
  const coverImage = book.coverImageUrl || `https://via.placeholder.com/300x450.png?text=${encodeURIComponent(book.title)}`;

  return (
    <div className="book-detail-modal-overlay" onClick={onClose}>
      <div className="book-detail-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="book-detail-close-button" onClick={onClose}>×</button>
        <div className="book-detail-container">
          <img src={coverImage} alt={`Cover of ${book.title}`} className="book-detail-image" />
          <div className="book-detail-info">
            <h2>{book.title}</h2>
            <p><strong>Author:</strong> {book.author}</p>
            <p><strong>Genre:</strong> {book.genre}</p>
            <p><strong>Published Year:</strong> {book.publishedYear}</p>
            <p><strong>Summary:</strong></p>
            <p className="book-detail-summary">{book.summary || "No summary available."}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;