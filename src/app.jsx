import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import List from './components/List';
import './index.css';

const initialData = {
  lists: {
    'list-1': {
      id: 'list-1',
      title: 'Por Hacer',
      cards: [
        { id: 'card-1', title: 'Planificar el proyecto' },
        { id: 'card-2', title: 'Diseñar la interfaz' },
        { id: 'card-3', title: 'Configurar el entorno' },
      ],
    },
    'list-2': {
      id: 'list-2',
      title: 'En Progreso',
      cards: [],
    },
    'list-3': {
      id: 'list-3',
      title: 'Terminado',
      cards: [],
    },
  },
  listOrder: ['list-1', 'list-2', 'list-3'],
};

function App() {
  const [board, setBoard] = useState(() => {
    const savedData = localStorage.getItem('trello-board');
    return savedData ? JSON.parse(savedData) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('trello-board', JSON.stringify(board));
  }, [board]);

  const onDragEnd = (result) => {
    const { destination, source, type } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Lógica para mover una tarjeta
    if (type === 'card') {
      const startList = board.lists[source.droppableId];
      const finishList = board.lists[destination.droppableId];

      if (startList === finishList) {
        const newCards = Array.from(startList.cards);
        const [movedCard] = newCards.splice(source.index, 1);
        newCards.splice(destination.index, 0, movedCard);
        const newStartList = { ...startList, cards: newCards };
        const newBoard = { ...board, lists: { ...board.lists, [newStartList.id]: newStartList } };
        setBoard(newBoard);
      } else {
        const startCardList = Array.from(startList.cards);
        const [movedCard] = startCardList.splice(source.index, 1);
        const finishCardList = Array.from(finishList.cards);
        finishCardList.splice(destination.index, 0, movedCard);

        const newStartList = { ...startList, cards: startCardList };
        const newFinishList = { ...finishList, cards: finishCardList };

        const newBoard = {
          ...board,
          lists: {
            ...board.lists,
            [newStartList.id]: newStartList,
            [newFinishList.id]: newFinishList,
          },
        };
        setBoard(newBoard);
      }
    }

    // Lógica para mover una lista
    if (type === 'list') {
      const newListOrder = Array.from(board.listOrder);
      const [movedListId] = newListOrder.splice(source.index, 1);
      newListOrder.splice(destination.index, 0, movedListId);
      const newBoard = { ...board, listOrder: newListOrder };
      setBoard(newBoard);
    }
  };

  const handleAddCard = (listId, cardTitle) => {
    const newCard = { id: `card-${Date.now()}`, title: cardTitle };
    const updatedLists = { ...board.lists };
    updatedLists[listId].cards.push(newCard);
    setBoard({ ...board, lists: updatedLists });
  };

  const handleAddList = (listTitle) => {
    if (!listTitle.trim()) return;
    const newId = `list-${Date.now()}`;
    const newList = {
      id: newId,
      title: listTitle,
      cards: [],
    };
    const updatedLists = { ...board.lists, [newId]: newList };
    const updatedListOrder = [...board.listOrder, newId];
    setBoard({ lists: updatedLists, listOrder: updatedListOrder });
  };

  const handleDeleteCard = (listId, cardId) => {
    const updatedLists = { ...board.lists };
    updatedLists[listId].cards = updatedLists[listId].cards.filter(card => card.id !== cardId);
    setBoard({ ...board, lists: updatedLists });
  };

  const handleDeleteList = (listId) => {
    const updatedLists = { ...board.lists };
    delete updatedLists[listId];
    const updatedListOrder = board.listOrder.filter(id => id !== listId);
    setBoard({ lists: updatedLists, listOrder: updatedListOrder });
  };
  
  // Lógica para el formulario de añadir lista
  const [newListTitle, setNewListTitle] = useState('');
  const handleAddListClick = () => {
      handleAddList(newListTitle);
      setNewListTitle('');
  };

  return (
    <div className="app-container">
      <h1 className="board-title">Trello Clone</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="list" direction="horizontal">
          {(provided) => (
            <div
              className="board-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {board.listOrder.map((listId, index) => {
                const list = board.lists[listId];
                return (
                  <Draggable draggableId={list.id} index={index} key={list.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <List
                          list={list}
                          onAddCard={handleAddCard}
                          onDeleteCard={handleDeleteCard}
                          onDeleteList={handleDeleteList}
                        />
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="add-list-form-container">
        <input
          type="text"
          placeholder="Título de la lista"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
        />
        <button className="add-list-button" onClick={handleAddListClick}>
          Añadir Lista
        </button>
      </div>
    </div>
  );
}

export default App;