import os
from flask import Blueprint, jsonify, request
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
    
    if not "file" in request.files:
        return jsonify({"error": "file is required"}), 400

    if request.files["file"].filename == "":
        return jsonify({"error": "file is required"}), 400
    
    file = request.files["file"]
    print(f"Archivo recibido: {file.filename}")
    
    controller = fileController()
    data = controller.create_file_search_store(file.filename,file)
    if data is None:
        return jsonify({"error": "No se pudo crear el store o guardar el archivo"}), 500

    try:
        response = controller.upload_file_to_store(
            data["file_path"], data["store"], file.filename
        )
        if response.startswith("Error al indexar"):
            return jsonify({"error": response}), 500
    finally:
        os.remove(data["file_path"])

    return jsonify({
        "file Storage": response,
        "store_name": data["store"]
    })

@api.route("/get/stores")
def files():
    return jsonify({
        "Storages": f"{fileController().get_search_stores()}"
    })

# @api.route("/files/create", methods=["POST"])
# def create_file_search_store(file):
#     display_name = file.filename
#     try:
#         store = fileController().create_file_search_store(display_name)
#         return {
#             "store_name": store.name,
#             "display_name": display_name
#         }
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

@api.route("/files/delete", methods=["DELETE"])
def delete_file_search_store():
    try:
        result = fileController().delete_file_search_store()
        return jsonify({
            "message": "File Search Store all deleted successfully",
            "result": result
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route("/files/delete-one", methods=["DELETE"])
def delete_one_file_search_store():
    data = request.get_json(silent=True)
    store_name = data.get("store_name") if isinstance(data, dict) else None
    if (
        not isinstance(store_name, str)
        or not store_name.startswith("fileSearchStores/")
        or len(store_name.split("/")) != 2
        or not store_name.split("/")[1]
    ):
        return jsonify({"error": "A valid store_name is required"}), 400

    try:
        result = fileController().delete_file_search_store(store_name)
        return jsonify({
            "message": "File Search Store deleted successfully",
            "result": result
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route("/files/get")
def get_files_to_store():
    stores = fileController().get_search_stores()
    files = fileController().get_files_to_store(store_name=f"{stores}")
    return jsonify({
        "Files in Store": str(files)
    })