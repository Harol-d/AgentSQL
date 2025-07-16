from setiings import LLM_PROVEEDOR, LLM_MODEL


def getLlm():
    if LLM_PROVEEDOR == "openai":
        from langchain.chat_models import ChatOpenAI
        return ChatOpenAI(model=LLM_MODEL)
    if LLM_PROVEEDOR == "gemini":
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(model=LLM_MODEL)
