from flask import Blueprint, request
from driver.db import db
from driver.middlewares import get_user

bp = Blueprint('clusters', __name__, url_prefix='/clusters')


@bp.get('')
def get_clusters():
    try:    
        user = get_user()
    except Exception as e:
        return {"error":str(e)},401
    
    return {"clusters":[ c.to_dict() for c in db.get_clusters(user_id=user.id) ]}

@bp.get('/runtimes')
def worker_types():
    #Todo: allow workers to give this info on registration
    return {"runtimes":[ r.to_dict() for r in db.get_cluster_runtimes() ]}

@bp.post('')
def create_cluster():
    try:    
        user = get_user()
    except Exception as e:
        return {"error":str(e)},401

    json = request.json
    if not json:
        return {"error": "No json provided"},400
    
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

@bp.delete('/<cluster_id>') 
def stop_cluster(cluster_id:str):
    try:    
        user = get_user()
    except Exception as e:
        return {"error":str(e)},402

    try:
        cluster = db.get_cluster(cluster_id=cluster_id,user_id=user.id)
    except Exception as e:
        return {"error":str(e)},400

    cluster.stop()
    
    return {"cluster":cluster.to_dict()}