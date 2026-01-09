import React from 'react';

const StarRating = ({ rating = 0, size = 20 }) => {
  const stars = [1, 2, 3, 4, 5];

  const starStyle = {
    color: '#ffc107',
    fontSize: `${size}px`,
    marginRight: '2px',
  };

  return (
    <div>
      {stars.map((star) => (
        <span key={star} style={starStyle}>
          {rating >= star ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
};

export default StarRating;