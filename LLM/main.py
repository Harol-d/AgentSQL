from flask import Flask
# from langchain_google_genai import ChatGooogleGenenerativeAI
# from langchain_core.messages import HumanMessage
# que es un blueprint?
from flask import jsonify
import json
from LmmController import lmmController

app = Flask(__name__)
controller = lmmController()

@app.route("/")
def index():
    data = '{"prompt": "como estas el dia de hoy?"}'
    data = json.loads(data)
    response = controller.inputValidate(data)
    return jsonify({
        "agente": response,
        "yo": data
    })


def main():
    app.run(host="0.0.0.0", port=4000)


if __name__ == "__main__":
    main()
