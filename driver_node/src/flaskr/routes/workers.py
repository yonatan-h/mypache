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
    try:
        if db.has_worker(address):
            return {"message":"Worker already registered"},200

        db.add_worker(worker)
        #Todo: remove automatic cluster creation after experimentaion
        clusters = db.get_clusters()
        if len(clusters) == 0:
            db.create_cluster(name="default", user_id="1", num_workers=1, runtime_id=db.get_cluster_runtimes()[0].id)

    except Exception as e:
        return {"error":str(e)},409

    return {"worker":worker.to_dict()}



@bp.get('/ratio')
def get_workers():
    busy_workers, idle_workers = db.get_busy_and_idle_workers()
    return {
        "busy": len(busy_workers),
        "idle": len(idle_workers)
    }