from flask import Blueprint, request
from worker.db import db
import myspark
import requests
import json

bp = Blueprint('instruction', __name__)

@bp.post('new')
def new_worker_df():
    res_json = request.json
    if not res_json:
        return {"error": "No json provided"},400
    
    file_id:str|None = res_json.get("file_id")
    slices:int|None = res_json.get("slices")
    slice:int|None = res_json.get("slice")

    if not file_id: return {"error":"No file_id provided"},400
    if not slices: return {"error":"No slices provided"},400
    if not slice: return {"error":"No slice provided"},400
    if not res_json.get('columns'): return {"error":"No columns provided"},400

    try:
        columns:list[myspark.Column] = []
        for col in res_json.get('columns'):
            columns.append(myspark.Column.from_dict(col))
    except Exception as e:
        return {"error":str(e)},400

    #todo: get address from env variable
    res = requests.get(f"http://localhost:5000/files/{file_id}/sliced/{slices}/{slice}")
    if res.status_code != 200:
        return { "error":res.json() },res.status_code
    
    data = res.text
    rows:list[myspark.Row] = []
    for i,line in enumerate(data.split("\n")):
        if line == "": continue
        raw_values = json.loads(line)  
        if not isinstance(raw_values, list):
            return {"error":f"Invalid data format in line {i}"},400
        
        values:list[myspark.Value] = raw_values
        rows.append(myspark.Row(values))

    try:
        df = myspark.WorkerDataFrame(columns=columns, rows=rows, nth_file_slice=0)
    except Exception as e:
        return {"error":str(e)},400
    
    db.add_df(df)
    return df.to_dict()

#Todo: add query for sliced row length
@bp.get('get/<id>')
def get_worker_df(id:str):
    if not db.has_df(id):
        return {"error":"Dataframe not found"},404
    df = db.get_df(id)
    return df.to_dict()


