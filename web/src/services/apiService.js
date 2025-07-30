import { URL_BASE } from './apiConfig';

// Servicio para el consumo de la API
class ApiService {
  
  // Método para enviar consultas SQL al backend
  async enviarConsulta(query) {
    try {
      const response = await fetch(`${URL_BASE}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error enviando consulta:', error);
      throw error;
    }
  }

  // Método para obtener el historial de conversaciones
  async obtenerHistorial() {
    try {
      const response = await fetch(`${URL_BASE}/api/history`);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo historial:', error);
      throw error;
    }
  }
}

export default new ApiService();
