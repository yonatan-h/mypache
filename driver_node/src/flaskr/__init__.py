from flask import Flask

from flaskr.models.cluster import Cluster
from flaskr.models.file import File
from flaskr.models.user import User
##

from flaskr.routes.notebooks import bp as notebooks_bp
from flaskr.routes.user import bp as users_bp
from flaskr.routes.workers import bp as workers_bp
from flaskr.routes.clusters import bp as clusters_bp
from flaskr.routes.files import bp  as files_bp
from flask_cors import CORS


import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)


__all__ = ["File", "Cluster", "User"]

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)

    app.register_blueprint(notebooks_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(workers_bp)
    app.register_blueprint(clusters_bp)
    app.register_blueprint(files_bp)
    return app


