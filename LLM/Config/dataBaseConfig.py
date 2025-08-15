from dataclasses import dataclass
from typing import Optional
from langchain_huggingface import HuggingFaceEmbeddings
import os



@dataclass
class PineconeConfig:
    PINECONE_API_KEY: Optional[str] = os.getenv("PINECONE_API_KEY")
    Modelo = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
    
    