from flask import Flask, jsonify, request
from LmmController import lmmController

app = Flask(__name__)
controller = lmmController()


@app.route("/response", methods=["POST"])
def index():
    prompt = request.get_json()
    response = controller.inputValidate(prompt)
    return jsonify({
        "response": response
    })


@app.route("/")
def welcome():
    return jsonify({
        "puerto4000": "estas consumiendo la api"
    })


def main():
    app.run(host="0.0.0.0", port=4000)


if __name__ == "__main__":
    main()
