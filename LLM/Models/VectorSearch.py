# SearchVectorModel.py
from google.cloud import aiplatform
from langchain_huggingface import HuggingFaceEmbeddings
import os

class SearchVectorModel:
    def __init__(self):
        self.project_id = os.getenv("PROJECT_ID")
        self.index_id = os.getenv("INDEX_ID")
        self.endpoint_id = os.getenv("ENDPOINT_ID")
        self.deployed_index_id = os.getenv("DEPLOYED_INDEX_ID")
        
        self.endpoint = aiplatform.MatchingEngineIndexEndpoint(
            index_endpoint_name=self.endpoint_id
        )
    
    def buscar_similitud(self, embeddings: list[str], num_neighbors: int):
        print(embeddings)
        results = self.endpoint.find_neighbors(
            deployed_index_id=self.deployed_index_id,
            queries=[embeddings],
            num_neighbors=num_neighbors
        )
        neighbor_id = results[0][0].id
        self.endpoint.read_index_datapoints(deployed_index_id=self.deployed_index_id, ids= [neighbor_id])
        return [neighbor.id for neighbor in results[0]]