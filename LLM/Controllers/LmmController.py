from Models.bucketModel import BucketModel
from Models.LlmModel import ModeLlm
from Models.VectorSearch import SearchVectorModel
from Models.AgentSqlModel import AgentSqlModel
from Services.doc import DocService

class lmmController:
    def __init__(self):
        self.model = ModeLlm()
        self.docService = DocService()
        self.bucketModel = BucketModel()
        self.searchVectorModel = SearchVectorModel()
    
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
            
            embeddings = self.docService.crearEmbeddings(prompt)
            similitud = self.searchVectorModel.buscar_similitud(embeddings,3)            
            file_content = self.bucketModel.obtenerEmbeddings()
            context = self.docService.fetch_text_chunks(similitud, file_content)
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
        
        response = AgentSqlModel().executeSql(sql)
        return response
