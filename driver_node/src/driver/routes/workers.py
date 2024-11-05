from flask import Blueprint, request
from driver.models.worker import Worker
from driver.db import db
from notebook import Notebook

bp = Blueprint('workers', __name__, url_prefix='/workers')

@bp.post('/register')
def register():
    json = request.json
    if not json:
        raise Exception("No data provided")

    address:str = json.get('address')
    if not address:
        raise Exception("No address provided")

    try:
        if db.has_worker(address):
            return {"message":"Worker already registered"},200
        print("registering worker", flush=True)
    except Exception as e:
        return {"error":str(e)},409

    worker = Worker(address=address)
    db.add_worker(worker)

    try:    
        #Todo: remove automatic cluster and notebook creation after experimentaion
        db.create_cluster(id="1",name="default", user_id="1", num_workers=1, runtime_id=db.get_cluster_runtimes()[0].id)
        cluster = db.get_cluster(user_id="1", cluster_id="1")
        user = db.get_user("1")
        file = db.get_file(file_id="1", user_id="1")
        db.add_notebook(Notebook(user=user, cluster=cluster, file=file, id="1"))

    except Exception as e:
        return {"error":str(e)},500

    return {"worker":worker.to_dict()}



@bp.get('/ratio')
def get_workers():
    busy_workers, idle_workers = db.get_busy_and_idle_workers()
    return {
        "busy": len(busy_workers),
        "idle": len(idle_workers)
    }