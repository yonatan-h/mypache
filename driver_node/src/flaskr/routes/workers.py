from flask import Blueprint, request
from flaskr.models.worker import Worker
from flaskr.db import db

bp = Blueprint('workers', __name__, url_prefix='/workers')

@bp.post('/register')
def register():
    json = request.json
    if not json:
        raise Exception("No data provided")

    address:str = json.get('address')
    if not address:
        raise Exception("No address provided")

    worker = Worker(address=address)
    db.add_worker(worker)
    return {"worker":worker.to_dict()}

