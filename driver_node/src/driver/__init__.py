from flask import Flask

from driver.models.cluster import Cluster
from driver.models.file import File
from driver.models.user import User
##

from driver.routes.notebooks import bp as notebooks_bp
from driver.routes.user import bp as users_bp
from driver.routes.workers import bp as workers_bp
from driver.routes.clusters import bp as clusters_bp
from driver.routes.files import bp  as files_bp
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


