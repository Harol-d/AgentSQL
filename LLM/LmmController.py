from model import ModeLlm
import json

class lmmController(ModeLlm):

    def inputValidate(self, data: str):
        prompt = json.dumps(data)
        # se debe de llamar al modelo
        # if (data is None or data == ""):
        # error = "Error: No se ha proporcionado un prompt válido."
        # return error
        response = ModeLlm.sendPrompt(self, prompt)
        return response
