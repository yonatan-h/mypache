from flask import Flask
from flaskr.routes.notebooks import bp as notebooks_bp
from flaskr.routes.user import bp as users_bp
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    app.register_blueprint(notebooks_bp)
    app.register_blueprint(users_bp)
    return app


