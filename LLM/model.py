from Factory import getLlm
from langchain_core.messages import HumanMessage


class ModeLlm:
    def __init__(self):
        self.model = getLlm()

    def sendPrompt(self, prompt: str):
        message = HumanMessage(prompt)
        response = self.model.invoke([message])
        return response.content
