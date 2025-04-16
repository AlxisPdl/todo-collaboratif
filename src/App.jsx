import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('normal');
  const [columns, setColumns] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const columnOrder = ['todo', 'inProgress', 'done'];
  const [selectedTasks, setSelectedTasks] = useState([]);

  const addTask = () => {
    if (task.trim() !== '') {
      const newTask = { text: task, priority };
      setColumns((prev) => ({
        ...prev,
        todo: [...prev.todo, newTask],
      }));
      setTask('');
      setPriority('normal');
    }
  };

  const toggleSelectTask = (column, index) => {
    const key = `${column}-${index}`;
    setSelectedTasks((prev) =>
      prev.includes(key)
        ? prev.filter((item) => item !== key)
        : [...prev, key]
    );
  };

  const deleteSelectedTasks = () => {
    const updatedColumns = { ...columns };

    selectedTasks.forEach((key) => {
      const [column, idx] = key.split('-');
      const index = parseInt(idx, 10);
      updatedColumns[column].splice(index, 1);
    });

    for (const col in updatedColumns) {
      updatedColumns[col] = [...updatedColumns[col]];
    }

    setColumns(updatedColumns);
    setSelectedTasks([]);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'urgent';
      case 'normal':
        return 'normal';
      case 'low':
        return 'low';
      default:
        return '';
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return; // No destination, do nothing

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    if (sourceCol === destCol) {
      // Reorder tasks within the same column
      const reorderedTasks = Array.from(columns[sourceCol]);
      const [moved] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, moved);

      setColumns((prev) => ({
        ...prev,
        [sourceCol]: reorderedTasks,
      }));
    } else {
      // Move tasks from one column to another
      const sourceTasks = Array.from(columns[sourceCol]);
      const destTasks = Array.from(columns[destCol]);
      const [moved] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, moved);

      setColumns((prev) => ({
        ...prev,
        [sourceCol]: sourceTasks,
        [destCol]: destTasks,
      }));
    }
  };

  return (
    <div className="app-container">
      <h1>Tableau des Tâches</h1>

      <div className="input-container">
  <input
    type="text"
    placeholder="Nouvelle tâche..."
    value={task}
    onChange={(e) => setTask(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && addTask()}
  />
  <select onChange={(e) => setPriority(e.target.value)} value={priority}>
    <option value="normal">Normal</option>
    <option value="urgent">Urgent</option>
    <option value="low">Pas urgent</option>
  </select>
  <button onClick={addTask}>Ajouter</button>

  {selectedTasks.length > 0 && (
    <div className="delete-inline">
      <button onClick={deleteSelectedTasks}>
        Supprimer ({selectedTasks.length})
      </button>
    </div>
  )}
</div>



      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {columnOrder.map((columnId) => (
            <div key={columnId} className="column-container">
              <h2 className="column-title">
                {columnId === 'todo' && 'À faire'}
                {columnId === 'inProgress' && 'En cours'}
                {columnId === 'done' && 'Terminé'}
              </h2>

              <Droppable key={columnId} droppableId={columnId}>
                {(provided) => (
                  <div
                    className="column"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {columns[columnId].length === 0 ? (
                      <p className="empty">Aucune tâche</p>
                    ) : (
                      columns[columnId].map((taskObj, index) => (
                        <Draggable
                          key={`${columnId}-${index}`}
                          draggableId={`${columnId}-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`task-item ${getPriorityClass(taskObj.priority)}`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedTasks.includes(`${columnId}-${index}`)}
                                onChange={() => toggleSelectTask(columnId, index)}
                              />
                              <span>{taskObj.text}</span>
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
