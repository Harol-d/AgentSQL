import React from 'react';
import { useState } from 'react';
// import ChatView from './components/Chat/ChatView';
import './style.css';
import './mobile.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = (message) => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          id: Date.now() + 1,
          text: `Consulta SQL procesada: ${message}`,
          sender: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-red-600 text-white p-4 shadow-md">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
              <span className="text-red-600 font-bold text-lg">🔒</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Asistente SQL</h1>
              <p className="text-red-100 text-sm">Consulta tus bases de datos con lenguaje natural</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-2xl">
                <h2 className="text-3xl font-bold text-red-600 mb-4">¡Bienvenido al Asistente SQL!</h2>
                <p className="text-gray-600 mb-8">
                  Haz preguntas sobre tus bases de datos en lenguaje natural. El asistente generará las consultas SQL necesarias y te mostrará los resultados.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-blue-500 text-2xl mb-2">👥</div>
                    <h3 className="font-semibold text-gray-800 mb-1">Consultar Usuarios</h3>
                    <p className="text-gray-600 text-sm">Muéstrame todos los usuarios registrados</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-yellow-500 text-2xl mb-2">💰</div>
                    <h3 className="font-semibold text-gray-800 mb-1">Análisis de Ventas</h3>
                    <p className="text-gray-600 text-sm">¿Cuáles fueron las ventas del último mes?</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-red-500 text-2xl mb-2">📦</div>
                    <h3 className="font-semibold text-gray-800 mb-1">Control de Inventario</h3>
                    <p className="text-gray-600 text-sm">Revisa el estado del inventario</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-red-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage(inputValue);
                    setInputValue('');
                  }
                }}
                placeholder="Escribe tu consulta aquí... (ej: 'Muéstrame los usuarios activos')"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                onClick={() => {
                  handleSendMessage(inputValue);
                  setInputValue('');
                }}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
          <div className="flex items-center justify-end">
            <div className="flex items-center text-sm text-gray-600">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Sin conexión
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;