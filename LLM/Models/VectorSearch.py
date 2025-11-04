# SearchVectorModel.py
from google.cloud import aiplatform
from langchain_huggingface import HuggingFaceEmbeddings
import os
import dotenv

dotenv.load_dotenv("../.env")

class SearchVectorModel:
    def __init__(self):
        # Configuración
        self.project_id = os.getenv("PROJECT_ID")
        self.index_id = os.getenv("INDEX_ID")
        self.endpoint_id = os.getenv("ENDPOINT_ID")
        self.deployed_index_id = os.getenv("DEPLOYED_INDEX_ID")
        
        # Referencias a índice y endpoint
        self.endpoint = aiplatform.MatchingEngineIndexEndpoint(
            index_endpoint_name=self.endpoint_id
        )
    
    def generar_embeddings(self, textos: list[str]) -> list:
        """Genera embeddings para una lista de textos"""
        return self.embedding_model.embed_documents(textos)
    
    def actualizar_indice(self, gcs_uri: str):
        """Actualiza el índice con embeddings desde GCS"""
        operation = self.index.update_embeddings(contents_delta_uri=gcs_uri)
        return operation
    
    def buscar_similitud(self, embeddings: list[str], num_neighbors: int):
        """Busca documentos similares a la query"""
        
        # Realizar búsqueda
        results = self.endpoint.find_neighbors(
            deployed_index_id=self.deployed_index_id,
            queries=[embeddings],
            num_neighbors=num_neighbors
        )
        
        neighbor_id = results[0][0].id
        self.endpoint.read_index_datapoints(deployed_index_id=self.deployed_index_id, ids= [neighbor_id])
        return [neighbor.id for neighbor in results[0]]
    
    def verificar_estado_indice(self):
        """Verifica el estado del índice"""
        return {
            "display_name": self.index.display_name,
            "description": self.index.description,
            "create_time": self.index.create_time,
            "update_time": self.index.update_time
        }
    
    def verificar_estado_endpoint(self):
        """Verifica el estado del endpoint"""
        deployed_indexes = []
        for deployed_index in self.endpoint.deployed_indexes:
            deployed_indexes.append({
                "id": deployed_index.id,
                "display_name": deployed_index.display_name,
                "index": deployed_index.index
            })
        return deployed_indexes