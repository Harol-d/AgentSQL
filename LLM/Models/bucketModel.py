from google.cloud import storage
import dotenv
import os
dotenv.load_dotenv("../.env")

class BucketModel:
    def __init__(self):
        self.client = storage.Client(project=os.getenv("PROJECT_ID"))
        self.bucket = self.client.bucket(os.getenv("BUCKET"))

    def obtenerEmbeddings(self):
        blob = self.bucket.blob("embeddings/embeddings.json")
        if blob.exists():
            return blob.download_as_text()
        return None

    def subirData(self, jsonl: str) -> bool:
        try: 
            blob = self.bucket.blob("embeddings/embeddings.json")
            blob.upload_from_string(jsonl, content_type="application/json")  
            return True
        except Exception as e:
            print(f"Error al subir el archivo al bucket: {str(e)}")
            return False