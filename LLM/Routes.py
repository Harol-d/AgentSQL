from functools import wraps
from flask import Flask , jsonify, request,current_app
from Controllers.LmmController import lmmController
from Controllers.bucketController import BucketController
from Services.doc import DocService
from Services.AuthService import AuthService
import sys
# import os

api = Flask('api', __name__)
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
    current_app.logger.info("Health check endpoint called.")
    return jsonify({
        "status": "healthy",
        "service": "AgentSQL LLM Service",
        "version": "1.0"
    }), 200


# def login_required(f):
#     @wraps(f)
#     def decorated_function(*args, **kwargs):
#         # Usamos tu clase para verificar
#         if not AuthService.is_authenticated():
#             return redirect(url_for("login"))
#         return f(*args, **kwargs)
#     return decorated_function

@api.route("/response", methods=["POST"])
def response():
    data = request.get_json()
    response = lmmController().responseModel(data)
    return jsonify({
        "LLM": response.text
    })

@api.route("/subir")
def crear():

    """ Endpoint para subir un archivo a un File Search Store en Google GenAI.
    Args:
        store_name: Nombre del store (ej: 'fileSearchStores/abc123')
        display_name: Nombre para identificar el archivo (opcional)
        custom_metadata: Lista de metadatos personalizados (opcional)
        mime_type: Tipo MIME del archivo (opcional)
    Returns:
        JSON con el resultado de la operación
    """
    # path = f"{os.getcwd()}/src/"
    # print (f"Path actual: {path}")
    # doc = DocService(api_key=os.environ["API_KEY"], path=path)
    # return jsonify({
    #     "file Storage": "Archivo subido correctamente"
    # })
    
    # response = doc.upload_file_to_store(store_name=os.environ["STORE_NAME"],
    # display_name="Serviciosvirtuales",
    # mime_type="text/plain")
    return jsonify({
        "file Storage": response
    })