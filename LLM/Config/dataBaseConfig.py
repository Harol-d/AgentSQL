from dataclasses import dataclass
from typing import Optional
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
import os

load_dotenv('../.env')

@dataclass
class PineconeConfig:
    PINECONE_API_KEY: Optional[str] = os.getenv("PINECONE_API_KEY")
    Modelo = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
    
    