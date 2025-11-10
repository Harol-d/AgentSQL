from flask import Blueprint, jsonify, request
from Controllers.LmmController import lmmController
from Controllers.bucketController import BucketController
import os


api = Blueprint('api', __name__)
@api.route("/response/sql", methods=["POST"])
def index_sql():
    data = request.get_json()
    response = lmmController().validateSQL(data)
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
    response = lmmController().promptValidate(data)
    return jsonify({
        "LLM": response
    })

@api.route("/crear")
def crear():
    sql_file_path = os.path.join(os.path.dirname(__file__), './db/Serviciosvirtuales.sql')
    response = BucketController().subirArchivo(sql_file_path)
    return jsonify({
        "Bucket": response
    })

@api.route("/mirar")
def mirar():
    return jsonify({
        "Secrets": os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    })