from .ModelFactory import factoryLlm
from langchain_core.messages import HumanMessage
from Config.settings import SettingsModel


class ModeLlm (SettingsModel):
    def __init__(self):
        self.factory = factoryLlm()
        self.model = self.factory.getLlm(self.LLM_PROVEEDOR, self.LLM_MODEL, self.API_KEY)
        
    def sendPrompt(self, prompt: str):
        message = HumanMessage(prompt)
        response = self.model.invoke([message,self.modelRole])
        return response.content
