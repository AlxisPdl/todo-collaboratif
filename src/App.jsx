import React, { useState } from 'react';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('normal'); // Ajouter un état pour la priorité
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
      setPriority('normal'); // Réinitialiser la priorité après l'ajout
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

  const moveTask = (from, index, direction) => {
    const fromIndex = columnOrder.indexOf(from);
    const toIndex = fromIndex + direction;

    if (toIndex < 0 || toIndex >= columnOrder.length) return;

    const to = columnOrder[toIndex];
    const taskToMove = columns[from][index];

    setColumns((prev) => {
      const newFrom = [...prev[from]];
      newFrom.splice(index, 1);
      const newTo = [...prev[to], taskToMove];

      return {
        ...prev,
        [from]: newFrom,
        [to]: newTo,
      };
    });
  };

  // Fonction pour appliquer la couleur de la priorité
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
      </div>

      {selectedTasks.length > 0 && (
        <div className="delete-bar">
          <button onClick={deleteSelectedTasks}>
            Supprimer les tâches sélectionnées ({selectedTasks.length})
          </button>
        </div>
      )}

      <div className="board">
        {columnOrder.map((column) => (
          <div key={column} className="column">
            <h2>
              {column === 'todo' && 'À faire'}
              {column === 'inProgress' && 'En cours'}
              {column === 'done' && 'Terminé'}
            </h2>

            {columns[column].length === 0 ? (
              <p className="empty">Aucune tâche</p>
            ) : (
              columns[column].map((taskObj, index) => (
                <div
                  key={index}
                  className={`task-item ${getPriorityClass(taskObj.priority)}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTasks.includes(`${column}-${index}`)}
                    onChange={() => toggleSelectTask(column, index)}
                  />
                  <span>{taskObj.text}</span>
                  <div className="actions">
                    {column !== 'todo' && (
                      <button onClick={() => moveTask(column, index, -1)}>
                        ←
                      </button>
                    )}
                    {column !== 'done' && (
                      <button onClick={() => moveTask(column, index, 1)}>
                        →
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
