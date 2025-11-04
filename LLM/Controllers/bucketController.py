# from Models.databaseVectorModel import databaseVectormodel
from Services.doc import DocService
from Models.bucketModel import BucketModel

class BucketController:
    def __init__(self):
        self.docService = DocService()
        self.bucketModel = BucketModel()
    
    def subirArchivo(self,doc: str):
        chunks = self.docService.crearChunks(doc)
        embeddings = self.docService.crearEmbeddings(chunks)
        jsonl = self.docService.embeddingsToJsonl(chunks, embeddings)
        response = self.bucketModel.subirData(jsonl)
        return response.get("mensaje")

    



    

