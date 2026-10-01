import os
import dotenv
from pathlib import Path


class AuthService:
    def __init__(self):
        self.env = dotenv.load_dotenv(".env")

    def init(self) -> dict | str:
        try: 
            dotenv.load_dotenv(".env")
        except Exception as e:
            return f"Error al cargar el archivo .env: {str(e)}"
        return self.get_secrets()
        

    def get_secrets(self) -> dict:
        return {
            "api_key": os.getenv("API_KEY"),
            "store_name": os.getenv("STORE_NAME"),
            "path_file": os.getenv("PATH_FILE")
        }