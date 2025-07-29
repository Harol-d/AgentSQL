import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const exampleMessages = [
  {
    id: 1,
    type: 'user',
    content: `¿Qué está mal en la sentencia?\nSELECT\nc.nombre AS nombre_cliente,\nc.ciudad,\np.nombre AS producto,\ndp.cantidad,\npr.precio,\n(dp.cantidad * pr.precio) AS ...`,
    time: '5:30 pm',
    full: false
  },
  {
    id: 2,
    type: 'system',
    content: `Tu consulta tiene un error por que tiene mal escrita una columna:\n\n\
\`\`\`sql\nSELECT\n  c.nombre AS nombre_cliente,\n  c.ciudad,\n  p.nombre AS producto,\n  dp.cantidad,\n  pr.precio,\n  (dp.cantidad * pr.precio) AS total_producto,\n  pe.fecha\nFROM pedidos pe\nJOIN clientes c ON pe.cliente_id = c.id\nJOIN detalle_pedidos dp ON pe.id = dp.pedido_id\nJOIN productos pr ON dp.product_id = pr.id  -- ERROR AQUÍ: columna mal escrita (debería ser producto_id)\nWHERE pe.fecha > '2024-01-01'\nORDER BY pe.fecha DESC;\n\`\`\``,
    time: '5:31 pm',
    full: false
  }
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const historyRef = useRef(null);
  const historyButtonRef = useRef(null);

  const [messages, setMessages] = useState(exampleMessages);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleHistory = () => {
    setHistoryOpen(!historyOpen);
  };

  const openModal = (msg) => {
    setModalMessage(msg);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalMessage(null);
  };
  const handleCopy = () => {
    if (modalMessage) {
      const codeMatch = modalMessage.content.match(/```sql([\s\S]*?)```/);
      const code = codeMatch ? codeMatch[1].trim() : modalMessage.content;
      navigator.clipboard.writeText(code);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
      if (
        historyRef.current &&
        !historyRef.current.contains(event.target) &&
        historyButtonRef.current &&
        !historyButtonRef.current.contains(event.target)
      ) {
        setHistoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-left" onClick={toggleHistory} ref={historyButtonRef} style={{cursor: 'pointer'}}>
          <i className="fas fa-book"></i>
        </div>
        <div className="header-center">
          <i className="fas fa-database"></i>
          <h1>AgentSQL</h1>
        </div>
        <div className="header-right" onClick={toggleMenu} ref={menuButtonRef}>
          <i className="fas fa-bars"></i>
        </div>
      </header>
      {/* Historial lateral izquierdo */}
      <div className={`history-sidebar${historyOpen ? ' open' : ''}`} ref={historyRef}>
        <div className="menu-header" onClick={toggleHistory}>
          <span>Historial</span>
          <i className="fas fa-book"></i>
        </div>
        <div className="history-content">
          <input className="history-search" type="text" placeholder="Buscar conversación" />
          <ul className="history-list">
            <li>
              <div className="history-title">¿Qué es SQL?</div>
              <div className="history-snippet">SQL, que significa 'Structured Query L...</div>
            </li>
            <li>
              <div className="history-title">¿Qué esta mal en la...</div>
              <div className="history-snippet">Revisando tu sentencia puedo notar que...</div>
            </li>
            <li>
              <div className="history-title">Como se vería esta s...</div>
              <div className="history-snippet">La sentencia ejecutada se debe mostrar de...</div>
            </li>
          </ul>
        </div>
      </div>
      {/* Menú lateral derecho */}
      <div className={`menu-sidebar${menuOpen ? ' open' : ''}`} ref={menuRef}>
        <div className="menu-header" onClick={toggleMenu}>
          <span>Menú</span>
          <i className="fas fa-bars"></i>
        </div>
        <ul>
          <li><i className="fas fa-home"></i> Inicio</li>
          <li><i className="fas fa-cog"></i> Configuración</li>
          <li><i className="fas fa-question-circle"></i> Ayuda</li>
          <li><i className="fas fa-info-circle"></i> Acerca de</li>
        </ul>
      </div>
      <main className="App-main">
        <div className="chat-container">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble ${msg.type}`}
              onClick={msg.type === 'system' ? () => openModal(msg) : undefined}
              style={msg.type === 'system' ? { cursor: 'pointer' } : {}}
            >
              {msg.type === 'user' ? (
                <div className="bubble-user">
                  <div className="bubble-content">{msg.content}</div>
                  <div className="bubble-time">{msg.time}</div>
                </div>
              ) : (
                <div className="bubble-system">
                  <div className="bubble-header">
                    <i className="fas fa-database"></i>
                  </div>
                  <div className="bubble-content">
                    {msg.content.split('```sql').length > 1 ? (
                      <>
                        {msg.content.split('```sql')[0].split('\n').map((line, i) => <div key={i}>{line}</div>)}
                        <pre className="sql-block">
                          {msg.content.split('```sql')[1].replace('```','').trim()}
                        </pre>
                      </>
                    ) : (
                      msg.content
                    )}
                  </div>
                  <div className="bubble-time">{msg.time}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        {/* Modal para mensaje ampliado */}
        {modalOpen && modalMessage && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-message" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <span>Tu consulta tiene un error por que tiene mal escrita una columna:</span>
                <button className="modal-close" onClick={closeModal}>×</button>
              </div>
              <div className="modal-content">
                <pre className="sql-block-modal">
                  {modalMessage.content.split('```sql')[1].replace('```','').trim()}
                </pre>
              </div>
              <button className="modal-copy" onClick={handleCopy}>Copiar</button>
            </div>
          </div>
        )}
      </main>
      <footer className="App-footer">
        <div className="input-container">
          <input type="text" placeholder="Escribe tu consulta SQL o pregunta..." />
          <button>
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </footer>
    </div>
  );
}

export default App;
