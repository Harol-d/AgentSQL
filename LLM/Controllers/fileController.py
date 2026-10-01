# from Controllers.bucketController import BucketController
import os
from Services.doc import DocService
class fileController:
    def __init__(self):
        # self.bucketController = BucketController()
        self.docService = DocService(os.getcwd() + "/src/download-1.pdf")

    def get_search_stores(self):
        return self.docService.get_file_search_stores()
    
    def create_file_search_store(self, display_name: str):
        return self.docService.create_file_search_store(display_name)
    
    def delete_file_search_store(self):
        return self.docService.delete_file_search_stores_all()
    
    def get_files_to_store(self,store_name: str):
        return self.docService.get_files_to_store(store_name)
    
    def upload_file_to_store(self, store_name: str, display_name: str):
        return self.docService.upload_file_to_store(store_name, display_name)