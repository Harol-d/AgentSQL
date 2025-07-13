from flask import Flask, jsonify

app = Flask(__name__)

print(app)


@app.route("/", methods=["GET"])
def welcome():
    return jsonify({
        "message": "Welcome to AgentSQL! This is a simple Flask application.",
        "status": "success",
        "version": "1.0.0"
    })


def main():
    app.run(host="0.0.0.0", port=3000)


if __name__ == "__main__":
    main()
