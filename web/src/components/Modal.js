import React from 'react';

const Modal = ({ isOpen, message, onClose, onCopy }) => {
  if (!isOpen || !message) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-message" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span>Tu consulta tiene un error por que tiene mal escrita una columna:</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">
          <pre className="sql-block-modal">
            {message.content.split('```sql')[1].replace('```','').trim()}
          </pre>
        </div>
        <button className="modal-copy" onClick={onCopy}>Copiar</button>
      </div>
    </div>
  );
};

export default Modal;
