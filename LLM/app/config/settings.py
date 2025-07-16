from dotenv import load_dotenv
import os

load_dotenv()
LLM_PROVEEDOR = os.getenv("LLM_PROVEEDOR")
LLM_MODEL = os.getenv("LLM_MODEL")
API_KEY = os.getenv("API_KEY")
