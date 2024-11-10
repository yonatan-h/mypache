from flask import Blueprint
from worker.db import db
import myspark

bp = Blueprint('instruction', __name__)

# @bp.post('/instruction/new/<file_id>')
def new_worker_df(file_id:str):
    print(db)
    columns = [myspark.Column("x")]
    rows = [myspark.Row([1]), myspark.Row([2])]
    worker_df = myspark.WorkerDataFrame(columns=columns, rows=rows, nth_file_slice=0)

    return worker_df.to_dict(5)

print(new_worker_df("1"), flush=True)

