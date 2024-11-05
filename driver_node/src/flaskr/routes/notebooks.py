from flask import Blueprint, request
from flaskr.db import db
from notebook import Notebook, Cell
from flaskr.middlewares import get_user

bp = Blueprint('notebooks', __name__, url_prefix='/notebooks')

@bp.get('')
def get_notebooks():
    try:
        user = get_user()
    except Exception as e:
        return {"error":str(e)},401

    return {
        "notebooks": [n.to_dict() for n in db.get_notebooks(user_id=user.id)]
    }

@bp.get('/<id>')
def get_notebook(id:str):
    try:
        user = get_user()
    except Exception as e:
        return {"error":str(e)},401

    notebook = db.find_notebook(user_id=user.id, id=id)
    if not notebook:
        return ({"error": "Notebook not found"}, 404)

    return { "notebook": notebook.to_dict() }

@bp.put('/<id>/run/<index>')
def run_cell(id:str, index:str):
    try:
        user = get_user()
    except Exception as e:
        return {"error":str(e)},401

    notebook = db.find_notebook(id=id, user_id=user.id)
    if not notebook:
        return ({"error": "Notebook not found"}, 404)

    #save cells
    request_data = request.get_json() #{cells:[{content:str, id:str}]}
    cells:list[Cell] = []
    for new_cell in request_data.get("cells"):
        cell_id:str|None = new_cell.get("id")

        if cell_id:
            cell = Cell(id=cell_id, content=new_cell.get("content"))
        else:
            cell = Cell(content=new_cell.get("content"))

        cells.append(cell)

    try:
        notebook.save_cells(cells)
        notebook.run(int(index))
    except Exception as e:
        return ({"error": str(e)}, 400)

    return { "notebook": notebook.to_dict() }

@bp.post('')
def create_notebook():
    try:
        user = get_user()
    except Exception as e:
        return {"error":str(e)},401

    request_data = request.get_json() #{fileId:str, clusterId:str}
    file_id = request_data.get("fileId")
    cluster_id = request_data.get("clusterId")

    if not file_id:
        return ({"error": "No file id provided"}, 400)
    if not cluster_id:
        return ({"error": "No cluster id provided"}, 400)
    
    try:
        file = db.get_file(file_id=file_id, user_id=user.id)
    except Exception as e:
        return ({"error": str(e)}, 400)
    
    try:
        cluster = db.get_cluster(cluster_id=cluster_id, user_id=user.id)
    except Exception as e:
        return {"error":str(e)}

    notebook = Notebook(user=user, file=file, cluster=cluster) 
    #Todo: remove hard coded id
    db.add_notebook(notebook)
    return { "notebook": notebook.to_dict() }

@bp.delete('/<id>')
def delete_notebook(id:str):
    try:
        user = get_user()
    except Exception as e:
        return {"error":str(e)},401

    notebook = db.find_notebook(id=id, user_id=user.id)
    if not notebook:
        return ({"error": "Notebook not found"}, 404)
    try:
        db.remove_notebook(id=id, user_id=user.id)
    except Exception as e:
        return ({"error": str(e)},400)

    return { "notebook": notebook.to_dict() }

