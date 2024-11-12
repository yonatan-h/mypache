from flask import Blueprint, request
from worker.db import db
import myspark
from os import environ
import requests

bp = Blueprint('instruction', __name__, url_prefix='/instruction')

@bp.post('new')
def new_worker_df():

    driver_addr = environ['DRIVER_ADDR']
    res_json = request.json
    if not res_json:
        return {"error": "No json provided"},400
    
    file_id:str|None = res_json.get("file_id")
    slices:int|None = res_json.get("slices")
    slice:int|None = res_json.get("slice")

    if file_id==None: return {"error":"No file_id provided"},400
    if slices==None: return {"error":"No slices provided"},400
    if slice==None: return {"error":"No slice provided"},400
    if res_json.get('columns')==None: return {"error":"No columns provided"},400

    try:
        columns:list[myspark.Column] = []
        print(res_json.get('columns'), flush=True)
        for col in res_json.get('columns'):
            columns.append(myspark.Column.from_dict(col))
        
        if not columns:
            return {"error":"No columns provided"}, 400

    except Exception as e:
        return {"error":str(e)},400

    #todo: get address from env variable
    res = requests.get(f"{driver_addr}/files/{file_id}/sliced/{slices}/{slice}")
    if res.status_code != 200:
        return { "error":res.json() },res.status_code
    
    data = res.text
    rows:list[myspark.Row] = []
    for line in data.split("\n"):
        if line == "": continue
        #Todo: find better hack
        raw_values = line.split(",")
        values:list[myspark.Value] = []
        for raw_val in raw_values:
            try:
                val = int(raw_val)
            except:
                try:
                    val = float(raw_val)
                except:
                    val = raw_val
            values.append(val)
            
        rows.append(myspark.Row(values))

    try:
        df = myspark.WorkerDataFrame(columns=columns, rows=rows, nth_file_slice=0)
    except Exception as e:
        return {"error":str(e)},400
    
    db.add_df(df)
    return df.to_dict()

#Todo: add query for sliced row length
@bp.get('get/<id>')
def get_df(id:str):
    if not db.has_df(id):
        return {"error":"Dataframe not found"},404
    df = db.get_df(id)
    return df.to_dict()

@bp.post('filter/<id>')
def filter_df(id:str):
    if not db.has_df(id):
        return {"error":"Dataframe not found"},404
    raw_json = request.json
    if not raw_json:
        return {"error":"No json provided"},400

    raw_condition = raw_json.get('condition')
    if not raw_condition:
        return {"error":"No condition provided"},400
    
    try:
        condition = myspark.Condition.from_dict(raw_condition)
    except Exception as e:
        return {"error":str(e)},400
    
    df = db.get_df(id)
    try:
        new_df = df.filter(condition) 
    except Exception as e:
        return {"error":str(e)},500
    
    db.add_df(new_df)
    return new_df.to_dict()

