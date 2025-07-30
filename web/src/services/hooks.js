import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

// Hook para manejar la lógica de los mensajes del chat
export const useMessages = () => {
  const [messages, setMessages] = useState([
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
  ]);

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const sendQuery = async (query) => {
    try {
      const response = await apiService.sendQuery(query);
      return response;
    } catch (error) {
      console.error('Error enviando consulta:', error);
      throw error;
    }
  };

  return {
    messages,
    addMessage,
    sendQuery
  };
};

// Hook para manejar el historial
export const useHistory = () => {
  const [history, setHistory] = useState([
    {
      title: "¿Qué es SQL?",
      snippet: "SQL, que significa 'Structured Query L..."
    },
    {
      title: "¿Qué esta mal en la...",
      snippet: "Revisando tu sentencia puedo notar que..."
    },
    {
      title: "Como se vería esta s...",
      snippet: "La sentencia ejecutada se debe mostrar de..."
    }
  ]);

  const loadHistory = async () => {
    try {
      const historyData = await apiService.getHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Error cargando historial:', error);
    }
  };

  return {
    history,
    loadHistory
  };
};
