# from Models.databaseVectorModel import databaseVectormodel
# from Services.doc import DocService
from Models.bucketModel import BucketModel

class BucketController:
    def __init__(self):
        # self.docService = DocService()
        self.bucketModel = BucketModel()
    
    def subirArchivo(self, doc: str):
        response = self.bucketModel.subirData()
        return response.get("mensaje")

    



    

