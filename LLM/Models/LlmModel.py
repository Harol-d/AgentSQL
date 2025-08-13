# from langchain_core.messages import HumanMessage,SystemMessage
from Config.LlmConfig import SettingsLlm
from Models.ModelFactory import factoryLlm
# from langchain.chains.question_answering import load_qa_chain # Obsoleto
from langchain_core.documents import Document
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains.combine_documents import create_stuff_documents_chain

class ModeLlm (SettingsLlm):
    def __init__(self):
        self.factory = factoryLlm()
        self.model = self.factory.getLlm(self.LLM_PROVEEDOR, self.LLM_MODEL, self.API_KEY)

    def sendPrompt(self, prompt: str, context: str):

        # 1. Define la plantilla del prompt para instruir al modelo sobre cómo usar el contexto.
        prompt_template = ChatPromptTemplate.from_template(
            """Responde la siguiente pregunta basándote únicamente en el siguiente contexto:

            Contexto:
            {context}

            Pregunta: {input}"""
        )

        # 2. Crea una cadena moderna que "rellena" (stuff) los documentos en el prompt.
        document_chain = create_stuff_documents_chain(self.model, prompt_template)

        # 3. Invoca la cadena con el contexto y la pregunta.
        #    La respuesta ya no es un diccionario, sino directamente el texto.
        response = document_chain.invoke({
            "input": prompt,
            "context": context
        })
        
        return response

    def imprimirVariables(self):
        return {
            "LLM_PROVEEDOR": self.LLM_PROVEEDOR,
            "LLM_MODEL": self.LLM_MODEL,
            "API_KEY": self.API_KEY
        }
