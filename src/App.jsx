import React from 'react';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>ToDo Collaboratif</h1>
      </header>
      
      <div className="columns-container">
        <div className="column">
          <h2>À faire</h2>
          <div className="task-card">Tâche 1</div>
          <div className="task-card">Tâche 2</div>
        </div>
        
        <div className="column">
          <h2>En cours</h2>
          <div className="task-card">Tâche 3</div>
        </div>

        <div className="column">
          <h2>Fait</h2>
          <div className="task-card">Tâche 4</div>
        </div>
      </div>
    </div>
  );
};

export default App;
