import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Card from './card';

function List({ list, onAddCard, onDeleteCard, onDeleteList }) {
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(list.id, newCardTitle);
      setNewCardTitle('');
    }
  };

  return (
    <div className="list">
      <div className="list-header">
        <h3 className="list-title">{list.title}</h3>
        <button className="delete-button" onClick={() => onDeleteList(list.id)}>
          Eliminar Lista
        </button>
      </div>

      <Droppable droppableId={list.id} type="card">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {list.cards.map((card, index) => (
              <Draggable draggableId={card.id} index={index} key={card.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card card={card} onDelete={() => onDeleteCard(list.id, card.id)} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="add-card-form">
        <input
          type="text"
          placeholder="Título de la tarjeta"
          value={newCardTitle}
          onChange={(e) => setNewCardTitle(e.target.value)}
        />
        <button className="add-card-button" onClick={handleAddCard}>
          Añadir Tarjeta
        </button>
      </div>
    </div>
  );
}

export default List;