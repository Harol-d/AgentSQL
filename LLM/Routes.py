from flask import Blueprint, jsonify, request
from Controllers.LmmController import lmmController
from Models.databaseVectorModel import databaseVectormodel
from Controllers.dataBaseVectorController import dataBaseVectorController
# from Models.LlmModel import ModeLlm
# from Controllers.dataBaseVectorController import DataBaseVectorController
import os

api = Blueprint('api', __name__)
@api.route("/response/sql", methods=["POST"])
def index_sql():
    data = request.get_json()
    response = lmmController().validateSQL(data)
    return jsonify({
        "LLM": response
    })

@api.route("/response", methods=["POST"])
def index():
    data = request.get_json()
    response = lmmController().promptValidate(data)
    return jsonify({
        "LLM": response
    })

@api.route("/eliminar")
def eliminar():
    databaseVectormodel.eliminarRecords()
    return jsonify({
        "mensaje": "Registros eliminados correctamente"
    })

@api.route("/crear")
def crear():
    sql_file_path = os.path.join(os.path.dirname(__file__), './db/Serviciosvirtuales.sql')
    chunks = dataBaseVectorController.crearChunks(sql_file_path)
    return jsonify({
        "mensaje": f"chunks creados correctamente: {chunks}"
    })
