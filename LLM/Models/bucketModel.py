from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore 
from google.cloud import storage
import dotenv
import os

dotenv.load_dotenv("../.env")

class BucketModel:
    def __init__(self):
        self.client = storage.Client(project=os.getenv("PROJECT_ID"))
        self.bucket = self.client.bucket(os.getenv("BUCKET"))

    def agregarRecords(self, chunks: str):
        blob = self.bucket.blob(f"{os.getenv('BLOB_NAME')}/{chunks}")
        blob.upload_from_string(chunks)
        return blob