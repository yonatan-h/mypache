from flask import Blueprint
from worker.db import db

bp = Blueprint('instruction', __name__)

@bp.post('/instruction/new/<file_id>')
def new_worker_df(file_id:str):
    print(db)
    return "hello"

