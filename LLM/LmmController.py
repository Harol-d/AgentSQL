from model import ModeLlm


class lmmController(ModeLlm):
    def inputValidate(self, data: str):

        if data is None or data == "":
            error = 'no se ha proporcionado un prompt'
            return error

        response = ModeLlm.sendPrompt(self, data)
        return response
