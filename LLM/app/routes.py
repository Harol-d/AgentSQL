from flask import jsonify, Blueprint
import json
from app.controllers.LmmController import lmmController


controller = lmmController()
bp = Blueprint('main', __name__)


@bp.route("/chat")
def index():
    data = '{"prompt": "que mmodelo eres?"}'
    data = json.loads(data)
    response = controller.inputValidate(data)
    return jsonify({
        "yo": data,
        "agente": response
    })


@bp.route('/')
def chat():
    return jsonify({
        "mensaje": "Ruta principal funcionando"
    })
