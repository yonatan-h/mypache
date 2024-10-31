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

@bp.get('/runtimes')
def worker_types():
    #Todo: allow workers to give this info on registration
    return {"runtimes":[
        {
            "id":"1sts",
            "name": "1.0 LTS",
            "lang": "Python 3.14",
        }
        ]}

@bp.get('/ratio')
def get_workers():
    busy_workers, idle_workers = db.get_busy_and_idle_workers()
    return {
        "busy": len(busy_workers),
        "idle": len(idle_workers)
    }