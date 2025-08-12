# from langchain_core.messages import HumanMessage,SystemMessage
from Config.LlmConfig import SettingsLlm
from Models.ModelFactory import factoryLlm
from langchain.chains.question_answering import load_qa_chain

class ModeLlm (SettingsLlm):
    def __init__(self):
        self.factory = factoryLlm()
        self.model = self.factory.getLlm(self.LLM_PROVEEDOR, self.LLM_MODEL, self.API_KEY)

    def sendPrompt(self, prompt: str, context: str):

        chain = load_qa_chain(self.model, chain_type="map_reduce")
        response = chain.run(input_documents=context, question=prompt)
        return response.content

    def imprimirVariables(self):
        return {
            "LLM_PROVEEDOR": self.LLM_PROVEEDOR,
            "LLM_MODEL": self.LLM_MODEL,
            "API_KEY": self.API_KEY
        }
