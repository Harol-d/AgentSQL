from Config.LlmConfig import SettingsLlm
from google import genai
from typing import List, Optional
from google.genai import types

# import os

class ModeLlm(SettingsLlm):
    def __init__(self):
        self.client = genai.Client(api_key=self.API_KEY)

    def search_file_store(self,
    query: str,
    store_names: List[str],
    metadata_filter: Optional[str] = None
    ) -> genai.types.GenerateContentResponse:
        """
        Realiza una búsqueda en uno o más File Search Stores.

        Args:
        query: Pregunta o consulta en lenguaje natural
        store_names: Lista de stores donde buscar
        metadata_filter: Filtro opcional de metadata

    Returns:
        Respuesta del modelo con el contenido generado
        """
        file_search_config = types.FileSearch(
            file_search_store_names=store_names
        )

        if metadata_filter:
            file_search_config.metadata_filter = metadata_filter

        response = self.client.models.generate_content(
            model=self.LLM_MODEL,
            contents=query,
            config=types.GenerateContentConfig(
                tools=[
                    types.Tool(
                    file_search=file_search_config
                )
            ]
        )
    )

        return response
