import React from 'react';

const Footer = () => {
  return (
    <footer className="App-footer">
      <div className="input-container">
        <input type="text" placeholder="Escribe tu consulta SQL o pregunta..." />
        <button>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
