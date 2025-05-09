import React from 'react';
import './LoadMoreButton.css';

const LoadMoreButton = ({ onClick, disabled, hasMore }) => {
  if (!hasMore) {
    return <p className="no-more-books">No more books to load.</p>;
  }
  return (
    <button onClick={onClick} disabled={disabled} className="load-more-button">
      {disabled ? 'Loading...' : 'Load More'}
    </button>
  );
};

export default LoadMoreButton;