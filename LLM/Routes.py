from flask import Blueprint, jsonify, request
from Controllers.LmmController import lmmController

api = Blueprint('api', __name__)
controller = lmmController()


@api.route("/response", methods=["POST"])
def index():
    prompt = request.get_json()
    response = controller.promtValidate(prompt)
    return jsonify({
        "response": response
    })


@api.route("/")
def welcome():
    return jsonify({
        "puerto4000": "estas consumiendo la api"
    })
