class factoryLlm:

    def getLlm(self, LLM_PROVEEDOR,LLM_MODEL, API_KEY):
        if LLM_PROVEEDOR == "gemini":
            from langchain_google_genai import ChatGoogleGenerativeAI
            modelo = ChatGoogleGenerativeAI(
                model=LLM_MODEL, google_api_key=API_KEY)
            return modelo

        if LLM_PROVEEDOR == "OpenAI":
            from langchain_openai import OpenAI
            modelo = OpenAI(model=LLM_MODEL, api_key=API_KEY)
            return modelo
