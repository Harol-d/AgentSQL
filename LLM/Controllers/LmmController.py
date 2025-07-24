from Models.LlmModel import ModeLlm

class lmmController(ModeLlm):
    def promtValidate(self, data: dict):
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
            
            response = ModeLlm.sendPrompt(self, prompt)
            return response
        
        

        
