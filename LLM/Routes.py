from flask import Blueprint, jsonify, request,current_app
from Controllers.LmmController import lmmController
from Controllers.fileController import fileController


api = Blueprint('api', __name__)
@api.route("/response/sql", methods=["POST"])
def index_sql():
    data = request.get_json()
    response = lmmController().responseAgentSQL(data)
    return jsonify({
        "LLM": response
    })

# Health check endpoint
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
        "LLM": response
    })

@api.route("/subir", methods=["POST"])
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
    store = fileController().get_search_stores()
    response = fileController().upload_file_to_store(store_name=f"{store[0]}",
    display_name="Prueba",
    )
    return jsonify({
        "file Storage": response
    })
@api.route("/get/stores")
def files():
    return jsonify({
        "Storages": f"{fileController().get_file_search_stores()}"
    })

@api.route("/files/create", methods=["POST"])
def create_file_search_store():
    display_name = "prueba" 
    if not display_name:
        return jsonify({"error": "display_name is required"}), 400

    try:
        store = fileController().create_file_search_store(display_name)
        return jsonify({
            "message": "File Search Store created successfully",
            "store": {
                "name": store.name,
                "display_name": display_name
            }
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route("/files/delete", methods=["DELETE"])
def delete_file_search_store():
    try:
        result = fileController().delete_file_search_store()
        return jsonify({
            "message": "File Search Store deleted successfully",
            "result": result
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route("/get/files/")
def get_files_to_store():
    stores = fileController().get_search_stores()
    files = fileController().get_files_to_store(store_name=f"{stores[0]}")
    return jsonify({
        "Files in Store": str(files)
    })