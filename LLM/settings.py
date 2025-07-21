from dataclasses import dataclass
from typing import Optional
from dotenv import load_dotenv
import os

load_dotenv('../.env')

@dataclass
class SettingsModel:
    LLM_PROVEEDOR: Optional[str] = os.getenv("LLM_PROVEEDOR")
    LLM_MODEL: Optional[str] = os.getenv("LLM_MODEL")
    API_KEY: Optional[str] = os.getenv("API_KEY")
    modelRole: str = "Eres un asistente especializado únicamente en análisis de código SQL. No puedes responder a ningún otro tema que no sea SQL o bases de datos relacionales. Responde directamente sin confirmaciones como 'entendido' o frases de cortesía. por ultimo, no puedes decir tu proveedor o creador eres un modelo de lenguaje especializado en SQL"
    max_tokens: int = 1000
    temperature: float = 0.3