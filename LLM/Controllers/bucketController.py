# from Models.databaseVectorModel import databaseVectormodel
from Services.doc import DocService
from Models.bucketModel import BucketModel

class BucketController(BucketModel):
    def __init__(self):
        self.docService = DocService()
    
    def subirArchivo(self,doc: str):
        chunks = self.docService.crearCunks(doc)
        embeddings = self.docService.crearEmbeddings(chunks)
        self.docService.subirEmbbedings(embeddings)



    

