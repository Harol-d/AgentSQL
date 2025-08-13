from flask import Blueprint, jsonify, request
from Controllers.LmmController import lmmController
from Models.databaseVectorModel import databaseVectormodel
# from Models.LlmModel import ModeLlm
# from Controllers.dataBaseVectorController import DataBaseVectorController

api = Blueprint('api', __name__)
llmresponse = lmmController()
dbModel  = databaseVectormodel()
# @api.route("/Var")  
# def imprimirVar():
#     responsedbmodel = dbModel.imprimirVariableDeEntorno()
#     # responsemodel = llmresponse.imprimirVariables()
#     # return jsonify({
#     #     "API_KEY_PINECONE": responsedbmodel,
#     #     "LLM": responsemodel
#     # })


@api.route("/response", methods=["POST"])
def index():
    prompt = request.get_json()
    response = llmresponse.promptValidate(prompt)
    return jsonify({
        "LLM": response
    })


@api.route("/")
def welcome():
    return jsonify({
        "puerto4000": "estas consumiendo la api"
    })
