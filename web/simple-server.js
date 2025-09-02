/**
 * Servidor simplificado para el Asistente SQL
 * Basado en LibreChat pero sin dependencias complejas
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(cors({
  origin:  'http://localhost:3000',
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));


// Configuración de endpoints disponibles
const endpoints = {
  'SQL-Agent': {
    name: 'SQL-Agent',
    type: 'custom',
    baseURL: process.env.SQL_AGENT_API_URL || 'http://localhost:4000',
    apiKey: process.env.SQL_AGENT_API_KEY || 'dev-key-12345',
    models: ['sql-assistant-v1', 'sql-query-generator', 'database-analyzer'],
    iconURL: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCAxMkwxMy4wOSAxNS43NEwxMiAyMkwxMC45MSAxNS43NEw0IDEyTDEwLjkxIDguMjZMMTIgMloiIGZpbGw9IiNEQzI2MjYiLz4KPC9zdmc+'
  }
};

// API Routes

// Configuración de la app
app.get('/api/config', (req, res) => {
  res.json({
    appTitle: 'Asistente SQL',
    appVersion: '1.0.0',
    endpoints: endpoints,
    interface: {
      customWelcome: '¡Bienvenido al Asistente SQL! 🗃️ Aquí puedes consultar bases de datos con lenguaje natural.',
      endpointsMenu: true,
      modelSelect: true
    },
    user: defaultUser
  });
});

// Usuario actual
app.get('/api/user', (req, res) => {
  res.json(defaultUser);
});

// Endpoint para enviar mensajes
app.post('/api/ask/:endpoint', async (req, res) => {
  const { endpoint } = req.params;
  const { text, conversationId, parentMessageId } = req.body;
  
  console.log(`📤 Enviando mensaje a ${endpoint}:`, text);
  
  try {
    const axios = require('axios');
    const endpointConfig = endpoints[endpoint];
    
    if (!endpointConfig) {
      return res.status(404).json({ error: 'Endpoint no encontrado' });
    }
    
    // Enviar al agente SQL
    const response = await axios.post(`${endpointConfig.baseURL}/response`, {
      prompt: text
    }, {
      headers: {
        'Authorization': `Bearer ${endpointConfig.apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 40000
    });
    
    const { data } = response;
    
    // Formatear respuesta compatible con LibreChat
    // Extraer el contenido de la respuesta de manera más robusta
    let content = '';
    if (typeof data === 'string') {
      content = data;
    } else if (typeof data === 'object' && data !== null) {
      // Intentar encontrar el contenido en diferentes propiedades comunes
      content = data.response || data.message || data.content || data.text || data.answer || data.result;
      
      // Si no se encuentra contenido en propiedades conocidas, usar el JSON completo
      if (!content) {
        // Verificar si hay algún valor de string en el objeto
        const stringValues = Object.values(data).filter(val => typeof val === 'string' && val.trim());
        if (stringValues.length > 0) {
          content = stringValues[0];
        } else {
          content = JSON.stringify(data, null, 2);
        }
      }
    } else {
      content = 'La respuesta de la API no pudo ser procesada correctamente.';
    }
    
    const chatResponse = {
      id: data.message_id || 'msg_' + Date.now(),
      conversationId: conversationId || 'conv_' + Date.now(),
      parentMessageId: parentMessageId,
      role: 'assistant',
      content: content,
      model: 'sql-assistant-v1',
      finish_reason: 'stop',
      metadata: {
        sql_query: data?.sql_query,
        execution_time: data?.execution_time,
        affected_rows: data?.affected_rows,
        raw_response: data
      }
    };
    
    res.json(chatResponse);
    
  } catch (error) {
    console.error('❌ Error en el chat:', error.message);
    
    res.status(500).json({
      id: 'error_' + Date.now(),
      conversationId: req.body.conversationId,
      parentMessageId: req.body.parentMessageId,
      role: 'assistant',
      content: `❌ Error al procesar la consulta: ${error.message}\\n\\n🔧 **Posibles soluciones:**\\n- Verificar que el servicio SQL Agent esté ejecutándose en http://localhost:8000\\n- Revisar la conexión de red\\n- Comprobar los logs del servidor`,
      error: true
    });
  }
});






// Modelos disponibles
app.get('/api/models', (req, res) => {
  res.json({
    'SQL-Agent': [
      {
        id: 'sql-assistant-v1',
        name: 'Asistente SQL Principal',
        description: 'Modelo principal para consultas SQL y análisis de bases de datos'
      },
      {
        id: 'sql-query-generator',
        name: 'Generador de Consultas',
        description: 'Especializado en generar consultas SQL optimizadas'
      },
      {
        id: 'database-analyzer',
        name: 'Analizador de BD',
        description: 'Análisis y optimización de esquemas de base de datos'
      }
    ]
  });
});



// Servir la aplicación para todas las rutas no API
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Asistente SQL Server running on http://localhost:${PORT}`);
  console.log(`📱 Open your browser to start chatting with your SQL databases!`);
  console.log(`🔗 Connected to SQL Agent: ${process.env.SQL_AGENT_API_URL || 'http://localhost:4000'}`);
});

module.exports = app;
