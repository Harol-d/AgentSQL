# from Models.bucketModel import BucketModel
from Models.LlmModel import ModeLlm
from Controllers.fileController import fileController
from Models.AgentSqlModel import AgentSqlModel
import os
# from Services.doc import DocService

class lmmController:
    def __init__(self) -> None:
        self.model = ModeLlm()
        # self.agentSql = AgentSqlModel()
        self.fileController = fileController()
        # self.stores = self.fileController.get_file_search_stores()

    def validarEntrada(self,entrada: str) -> bool:
         match entrada:
            case None:
                return False
            case str() if entrada.strip() == "":
                return False
            case str():
                return True
            case _:
                return False

    def responseModel(self,data: dict) -> str:
        prompt = data.get("prompt")
        print(f"Prompt recibido: {prompt}")
        print(f"Stores disponibles: {len(fileController().get_search_stores())}")
        if self.validarEntrada(prompt):
            return self.model.search_file_store(prompt,fileController().get_search_stores())

    def get_Models(self) -> list:
        return self.model.models.list()
    
    # def responseAgentSQL (self, data: dict) -> str:
    #     sql = data.get("sql")
    #     if self.validarEntrada(sql):
    #         return self.agentSql.executeSql(sql)
    #     return ("no se proporciono un Query SQL")
