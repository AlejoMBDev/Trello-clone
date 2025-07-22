import React from 'react';

function Card({ card, onDelete }) {
  return (
    <div className="card">
      <div className="card-header">
        <p>{card.title}</p>
        <button className="delete-button" onClick={onDelete}>
          X
        </button>
      </div>
    </div>
  );
}

export default Card;