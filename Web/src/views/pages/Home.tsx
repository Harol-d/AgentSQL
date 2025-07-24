import React, { useRef } from 'react';
import Header from '../components/Header';

const Home: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      alert(`Archivos seleccionados: ${Array.from(files).map(f => f.name).join(', ')}`);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para manejar el envío del formulario
  };

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-red-600 text-center mb-8">AgentSQL</h1>
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg border-2 border-red-600 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-2">
              <input 
                type="text" 
                name="Prompt" 
                placeholder="Escribe tu prompt aquí" 
                autoComplete="off" 
                required
                className="flex-1 px-4 py-3 border-2 border-red-600 rounded-lg focus:outline-none focus:border-red-800 focus:ring-2 focus:ring-red-200 text-gray-800 placeholder-gray-500"
              />
              {/* Botón para subir archivos */}
              <button 
                type="button"
                onClick={handleFileUpload}
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                title="Subir archivo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </button>
              {/* Botón de enviar con icono */}
              <button 
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                title="Enviar mensaje"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
              </button>
            </div>
            {/* Input file oculto */}
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept=".txt,.pdf,.doc,.docx,.csv,.json"
              multiple
              onChange={handleFileChange}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
