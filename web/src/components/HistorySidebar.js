import React from 'react';

const HistorySidebar = ({ isOpen, onToggle, historyRef, history }) => {
  return (
    <div className={`history-sidebar${isOpen ? ' open' : ''}`} ref={historyRef}>
      <div className="menu-header" onClick={onToggle}>
        <span>Historial</span>
        <i className="fas fa-book"></i>
      </div>
      <div className="history-content">
        <input className="history-search" type="text" placeholder="Buscar conversación" />
        <ul className="history-list">
          {history.map((item, index) => (
            <li key={index}>
              <div className="history-title">{item.title}</div>
              <div className="history-snippet">{item.snippet}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HistorySidebar;
