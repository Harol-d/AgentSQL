from langchain_community.utilities import SQLDatabase
import os

class DataBaseRelMode:

    def __init__(self):
        # Obtener la ruta absoluta del directorio actual
        current_dir = os.path.dirname(__file__)
        db_dir = os.path.join(current_dir, '..', 'db')
        self.db_path = os.path.join(db_dir, 'prueba.db')
        # Convertir a ruta absoluta para evitar problemas
        self.db_path = os.path.abspath(self.db_path)
        self.db_uri = f"sqlite:///{self.db_path}"

    def getDb(self):
        # Verificar que el archivo existe antes de crear la conexión
       
        
        # Devolver la instancia de SQLDatabase de LangChain
        db = SQLDatabase.from_uri(self.db_uri)
        return db


