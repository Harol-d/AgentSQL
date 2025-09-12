from langchain_community.agent_toolkits import create_sql_agent
from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
from Models.DataBaseRelModel import DataBaseRelModel
from Models.LlmModel import ModeLlm 

class AgentSqlModel(ModeLlm):
    def __init__(self):
        super().__init__()  # Inicializar la clase padre primero
        self.db = DataBaseRelModel().getDb()
        self.toolkit = SQLDatabaseToolkit(db=self.db, llm=self.model)
        self.agent = create_sql_agent(
            llm=self.model,
            toolkit=self.toolkit,
            verbose=True,
            agent_type="tool-calling"
        )

    def executeSql(self, sql: str):
        response = self.agent.invoke({"input": sql+"\n\n"+"da la respuesta en español"})
        response = response.get("output")
        return response