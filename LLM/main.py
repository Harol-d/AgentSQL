from flask import Flask
from app.routes import bp
# from langchain_google_genai import ChatGooogleGenenerativeAI
# from langchain_core.messages import HumanMessage
app = Flask(__name__)
# que es un blueprint?
app.register_blueprint(bp)



def main():
    app.run(host="0.0.0.0", port=4000)


if __name__ == "__main__":
    main()
