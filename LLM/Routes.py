from flask import Blueprint, jsonify, request
from Controllers.LmmController import lmmController
from Controllers.bucketController import BucketController
from Services.doc import DocService
import os
import dotenv
dotenv.load_dotenv(".env")
os.environ["API_KEY"] = os.getenv("API_KEY")
os.environ["PATH_FILE"] = os.getenv("PATH_FILE")
os.environ["STORE_NAME"] = os.getenv("STORE_NAME")

api = Blueprint('api', __name__)
@api.route("/response/sql", methods=["POST"])
def index_sql():
    data = request.get_json()
    response = lmmController().responseAgentSQL(data)
    return jsonify({
        "LLM": response
    })

# Health check endpoint para Cloud Run
@api.route("/")
def index():
    return jsonify({
        "status": "healthy",
        "service": "AgentSQL LLM Service",
        "version": "1.0"
    }), 200

@api.route("/response", methods=["POST"])
def response():
    data = request.get_json()
    response = lmmController().responseModel(data)
    return jsonify({
        "LLM": response.text
    })

@api.route("/subir")
def crear():
    doc = DocService(api_key=os.environ["API_KEY"], path=os.environ["PATH_FILE"])
    response = doc.upload_file_to_store(store_name=os.environ["STORE_NAME"],
    display_name="Serviciosvirtuales",
    mime_type="text/plain")
    return jsonify({
        "file Storage": response
    })