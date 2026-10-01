# AgentSQL

## ¿Qué es AgentSQL?

AgentSQL es un asistente inteligente especializado en SQL que ayuda a ingenieros y desarrolladores a revisar, corregir y mejorar código SQL.

## ¿Cómo funciona?

El sistema utiliza un enfoque de **Retrieval-Augmented Generation (RAG)**:

1. **Recibe tu consulta SQL** - A través de la interfaz web
2. **Busca contexto relevante** - En la base de datos vectorial con información de servicios virtuales
3. **Genera respuesta especializada** - Usando modelos de IA (Gemini o OpenAI) con el contexto encontrado

## Arquitectura del Proyecto

Seguimos una **arquitectura MVC** donde:

- **📁 Modelos**: Conexiones directas con herramientas externas (LLM y base de datos vectorial,, dependen directamente de la capa de config )
- **🎯 Controladores**: Contienen toda la lógica de negocio
- **⚙️ Config**: Configuraciones que alimentan a los modelos

## Componentes Principales

### Backend (LLM/)
- **Flask API** - Servidor que procesa las peticiones
- **Pinecone** - Base de datos vectorial para almacenar contexto
- **LangChain** - Framework para manejar la IA

### Frontend (web/)
- **React** - Interfaz de usuario del chat
- **Componentes modulares** - Header, chat, sidebar, etc.

## ¿Qué puede hacer?

- ✅ **Revisar código SQL** y detectar errores
- 🔧 **Corregir sintaxis** y mejorar consultas
- 📊 **Analizar el impacto** de las consultas
- 🗃️ **Identificar tablas afectadas y cantidad de registros afectados**
- 💡 **Explicar el código** de manera técnica

## Tecnologías Utilizadas

- **Backend**: Python, Flask, LangChain, Pinecone
- **Frontend**: React, JavaScript
- **IA**: Google Gemini / OpenAI 
- **Despliegue**: Docker, Docker 

## Instalación y Uso

1. Clona el repositorio
2. Configura las variables de entorno (usa `env.example`)
3. Ejecuta con Docker Compose: `docker-compose up`
4. Accede a la aplicación en `http://localhost:3000`

El sistema estará disponible con el backend en el puerto 4000 y el frontend en el puerto 3000.
