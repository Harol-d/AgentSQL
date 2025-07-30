import React, { useState, useEffect, useRef } from 'react';
import './styles/App.css';

// Importación de componentes (capa de diseño y vistas)
import {
  Header,
  HistorySidebar,
  MenuSidebar,
  ChatContainer,
  Modal,
  Footer
} from './components';

// Importación de hooks y servicios (capa de consumo de API y lógica)
import { useMessages, useHistory } from './services';

function App() {
  // Estados locales para la UI
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState(null);
  
  // Referencias para el manejo de clicks fuera de los menús
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const historyRef = useRef(null);
  const historyButtonRef = useRef(null);

  // Hooks para la lógica de negocio
  const { messages, addMessage, sendQuery } = useMessages();
  const { history, loadHistory } = useHistory();

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
      <Header 
        onToggleMenu={toggleMenu}
        onToggleHistory={toggleHistory}
        menuButtonRef={menuButtonRef}
        historyButtonRef={historyButtonRef}
      />
      
      <HistorySidebar 
        isOpen={historyOpen}
        onToggle={toggleHistory}
        historyRef={historyRef}
        history={history}
      />
      
      <MenuSidebar 
        isOpen={menuOpen}
        onToggle={toggleMenu}
        menuRef={menuRef}
      />
      
      <main className="App-main">
        <ChatContainer 
          messages={messages}
          onOpenModal={openModal}
        />
        
        <Modal 
          isOpen={modalOpen}
          message={modalMessage}
          onClose={closeModal}
          onCopy={handleCopy}
        />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
