# from Models.bucketModel import BucketModel
from Models.LlmModel import ModeLlm
# from Models.VectorSearch import SearchVectorModel
from Models.AgentSqlModel import AgentSqlModel
import os
# from Services.doc import DocService

class lmmController:
    def __init__(self) -> None:
        self.model = ModeLlm()
        self.agentSql = AgentSqlModel()

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
        if self.validarEntrada(prompt):
            return self.model.search_file_store(prompt,store_names=[os.environ["STORE_NAME"]])
        return ("no se proporciono un prompt")

    def responseAgentSQL (self, data: dict) -> str:
        sql = data.get("sql")
        if self.validarEntrada(sql):
            return self.agentSql.executeSql(sql)
        return ("no se proporciono un Query SQL")
