from langchain_community.agent_toolkits import create_sql_agent
from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
from Models.DataBaseRelModel import DataBaseRelModel
from Config.LlmConfig import SettingsLlm
from langchain_google_genai import ChatGoogleGenerativeAI

class AgentSqlModel(SettingsLlm):
    def __init__(self):
        self.model = ChatGoogleGenerativeAI(
                model=self.LLM_MODEL,
                google_api_key=self.API_KEY,
                temperature=self.temperature,
                max_output_tokens=self.max_tokens
            )
        self.db = DataBaseRelModel().getDb()
        self.toolkit = SQLDatabaseToolkit(db=self.db, llm=self.model)
        self.agent = create_sql_agent(
            llm=self.model,
            toolkit=self.toolkit,
            verbose=True,
            agent_type="tool-calling"
        )

    def executeSql(self, sql: str) -> str:
        response = self.agent.invoke({"input": sql+"\n\n"+"da la respuesta en español"})
        return response.get("output")