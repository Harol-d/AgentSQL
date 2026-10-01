from flask import Flask
from flask_cors import CORS
from Routes import api
from Services.AuthService import AuthService
import sys

app = Flask(__name__)
CORS(app)
app.register_blueprint(api)


def main():
    app.logger.debug("Starting the Flask application...")
    app.run(host="0.0.0.0", port=4000)


if __name__ == "__main__":
    main()
