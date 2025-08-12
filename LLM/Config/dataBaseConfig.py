from dataclasses import dataclass
from typing import Optional
from dotenv import load_dotenv
from langchain_community.embeddings import HuggingFaceEmbeddings
import os

load_dotenv('../.env')

@dataclass
class PineconeConfig:
    API_KEY_PINECONE: Optional[str] = os.getenv("API_KEY_PINECONE")
    Modelo = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
    
    