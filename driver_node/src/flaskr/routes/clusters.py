from flask import Blueprint, request
from flaskr.db import db
from flaskr.middlewares import get_user

bp = Blueprint('clusters', __name__, url_prefix='/clusters')

@bp.get('/runtimes')
def worker_types():
    #Todo: allow workers to give this info on registration
    return {"runtimes":[ r.to_dict() for r in db.get_cluster_runtimes() ]}

@bp.post('/')
def create_cluster():
    try:    
        user = get_user()
    except Exception as e:
        return {"error":str(e)},402

    json = request.json
    if not json:
        raise Exception("No data provided")
    
    name:str|None = json.get('name')
    workers:int|None = json.get('workers')
    runtime_id:str|None = json.get('runtimeId')

    if not name:
        return {"error":"No name provided"},400
    if workers == None or workers < 0:
        return {"error":"No workers provided"},400
    if workers == 0:
        return {"error":"Need at least 1 worker"},400
    if not runtime_id:
        return {"error":"No runtimeId provided"},400
    
    cluster = db.create_cluster(
        name=name, user_id=user.id, num_workers=workers, runtime_id=runtime_id
    )
    return cluster.to_dict()
    