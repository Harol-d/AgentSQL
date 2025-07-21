from flask import Flask, jsonify, render_template, request
from dotenv import load_dotenv
import requests
import os
load_dotenv("../../.env")


urlBase = os.getenv("APP_URL")
app = Flask(__name__, template_folder='../templates')

@app.route("/")
def welcome():
    return render_template('index.html')

@app.route("/api-chat", methods=['POST'])
def procesar():
    try:
        # Verificar si los datos vienen de un formulario HTML o JSON
        if request.content_type == 'application/x-www-form-urlencoded':
            # Datos de formulario HTML (como Laravel)
            prompt = request.form.get('Prompt')

        response = requests.post(f"{urlBase}/response", json=[{"Prompt": prompt}])
        response_data = response.json()

        return jsonify(response_data), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def main():
    app.run(host="0.0.0.0", port=3000)


if __name__ == "__main__":
    main()
