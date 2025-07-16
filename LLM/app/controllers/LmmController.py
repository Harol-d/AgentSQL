from models import ModeLlm
import json


class lmmController(ModeLlm):

    def inputValidate(data: str):
        prompt = json.dumsp(data)
        # se debe de llamar al modelo
        # if (data is None or data == ""):
        # error = "Error: No se ha proporcionado un prompt válido."
        # return error
        response = ModeLlm.sendPrompt(prompt)
        return response
