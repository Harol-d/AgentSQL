// Aquí irá la lógica para consumir la API REST

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Ejemplo de función para consumir la API
export async function fetchData(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  return response.json();
}
