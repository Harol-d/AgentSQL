# from Controllers.bucketController import BucketController
# import os
from Services.docService import DocService

class fileController:
    def __init__(self):
        # self.bucketController = BucketController()
        self.docService = DocService()

    def get_search_stores(self):
        return self.docService.get_file_search_stores()
    
    def create_file_search_store(self, display_name: str,file: str) -> dict | None:
        return self.docService.create_file_search_store(display_name,file)
    
    def delete_file_search_store(self):
        return self.docService.delete_file_search_stores_all()
    
    def get_files_to_store(self,store_name: str):
        return self.docService.get_files_to_store(store_name)
    
    def upload_file_to_store(self,file: str, store_name: str, display_name: str):
        return self.docService.upload_file_to_store(file,store_name, display_name)