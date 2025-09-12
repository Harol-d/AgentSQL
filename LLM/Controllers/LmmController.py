from Models.LlmModel import ModeLlm
from Controllers.dataBaseVectorController import dataBaseVectorController
from Models.AgentSqlModel import AgentSqlModel

class lmmController:
    def __init__(self):
        self.model = ModeLlm()
        self.database = dataBaseVectorController()
        self.agentSql = AgentSqlModel()
    def promptValidate(self, data: dict):
            try:
                prompt = data.get("prompt")
                
                if prompt is None:
                    raise ValueError("Error: No se ha proporcionado un prompt.")
                
                if not isinstance(prompt, str):
                    raise TypeError("Error: El prompt debe ser un String.")
                
                if prompt.strip() == "":
                    raise ValueError("Error: El prompt no puede estar vacío.")
                
                prompt = prompt.strip()
                
            except (ValueError, TypeError) as e:
                return str(e)
            
            # response = ModeLlm.sendPrompt(self, prompt)
            context = self.database.obtenerRecords(prompt)
            response = self.model.sendPrompt(prompt, context)
            return response

    def validateSQL (self, data: dict):
        try:
            sql = data.get("sql")
            if sql is None:
                raise ValueError("Error: No se ha proporcionado un sql.")
            if not isinstance(sql, str):
                raise TypeError("Error: El sql debe ser un String.")
            if sql.strip() == "":
                raise ValueError("Error: El prompt no puede estar vacío.")
        except (ValueError, TypeError) as e:
            return str(e)
        
        response = self.agentSql.executeSql(sql)
        return response
