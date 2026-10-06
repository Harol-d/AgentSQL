import os
from typing import Optional, List, Dict
from google import genai
from Services.AuthService import AuthService
import time
from google.genai import types

class DocService():
    def __init__(self) -> None:
        self.secret = AuthService().get_secrets()
        self.client = genai.Client(api_key=self.secret["key"])
    
    def create_file_search_store(self,display_name: str,file) -> genai.types.FileSearchStore | None:
        """
    Crea un nuevo File Search Store.

    Args:
        display_name: Nombre descriptivo para identificar el store

    Returns:
        FileSearchStore object con información del store creado
    """
        try:  
            store = self.client.file_search_stores.create(
                config={'display_name': display_name}
            )

            print(f" Store creado exitosamente")
            print(f"   • Nombre: {store.name}")
            print(f"   • Display Name: {display_name}")
            
            ruta_directorio = os.path.join(os.getcwd(), "src", store.name)
            print(f"   • Ruta del directorio: {ruta_directorio}")
            
            # Extraer el nombre del archivo como string
            ruta_completa = os.path.join(ruta_directorio, file.filename)
            
            os.makedirs(ruta_directorio, exist_ok=True)
            
            # Si deseas guardar el archivo en el directorio creado:
            file.save(ruta_completa)
            
            return  {
                "store": store.name,
                "file_path": ruta_completa
            }
        except Exception as e:
            print(f"Error al crear el store: {str(e)}")
        return None

    def upload_file_to_store(self,
        file: str,
        store_name: str,
        display_name: Optional[str] = None,
        custom_metadata: Optional[List[Dict]] = None,
        mime_type: Optional[str] = None
    ) -> str:
        """
        Sube e indexa un archivo directamente en un File Search Store.

        Args:
            file: Ruta local al archivo
            store_name: Nombre del store (ej: 'fileSearchStores/abc123')
            display_name: Nombre para identificar el archivo (opcional)
            custom_metadata: Lista de metadatos personalizados (opcional)

        Returns:
            bool: True si la indexación fue exitosa
        """
        try:
            config = {}
            if display_name:
                config['display_name'] = display_name
            if custom_metadata:
                config['custom_metadata'] = custom_metadata
            if mime_type:
                config['mime_type'] = mime_type

            # Iniciar la operación de upload
            operation = self.client.file_search_stores.upload_to_file_search_store(
                file=file,
                file_search_store_name=store_name,
                config=config if config else None,
                )

            # Esperar a que la indexación complete
            print(f"Indexando (esto puede tomar algunos segundos)...")
            while not operation.done:
                time.sleep(5)
                operation = self.client.operations.get(operation)

            print(f"Archivo indexado \n")
            return f"Archivo subido e indexado correctamente"

        except Exception as e:
            return f"Error al indexar el archivo: {str(e)}"
        
    def get_file_search_stores(self) -> List[str]:
        stores = []
        try:
            for i in self.client.file_search_stores.list():
                stores.append(i.name)
            return stores
        except Exception as e:
            print(f"Error al obtener los stores: {str(e)}")
            return []
    def delete_file_search_stores_all(self) -> str:
        try: 
            for i in self.client.file_search_stores.list():
                self.client.file_search_stores.delete(name=i.name,config={'force': True})
            return f"Stores eliminados {i.name}"
        except Exception as e:
            return f"No se encontraron stores para eliminar {str(e)}"

    def get_files_to_store(self,store_name: str) -> List[str]:
        try:
            return str(self.client.file_search_stores.get(name=store_name))
        except Exception as e:
            print(f"Error al obtener los archivos del store: {str(e)}")
            return []
