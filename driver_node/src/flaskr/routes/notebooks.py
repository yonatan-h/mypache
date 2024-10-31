from flask import Blueprint, request
from flaskr.db import db
from notebook import Notebook, Cell
from flaskr.middlewares import get_user

bp = Blueprint('notebooks', __name__, url_prefix='/notebooks')

@bp.get('/')
def get_notebooks():
    user = get_user()
    return {
        "notebooks": [n.to_dict() for n in db.get_notebooks(user_id=user.id)]
    }

@bp.get('/<id>')
def get_notebook(id:str):
    notebook = db.find_notebook(id)
    if not notebook:
        return ({"error": "Notebook not found"}, 404)
    return { "notebook": notebook.to_dict() }

@bp.put('/<id>/run/<index>')
def run_cell(id:str, index:str):
    print('before2--', flush=True)
    notebook = db.find_notebook(id)
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
        print('before--', flush=True)
        notebook.save_cells(cells)
        print('after--', flush=True)
        notebook.run(int(index))
    except Exception as e:
        return ({"error": str(e)}, 400)

    return { "notebook": notebook.to_dict() }

@bp.post('/')
def create_notebook():
    request_data = request.get_json() #{fileId:str, clusterId:str}
    notebook =Notebook(user_id="1", file_id=request_data.get("fileId"), cluster_id=request_data.get("clusterId"))
    #Todo: remove hard coded id
    db.add_notebook(notebook)
    return { "notebook": notebook.to_dict() }

@bp.delete('/<id>')
def delete_notebook(id:str):
    notebook = db.find_notebook(id)
    if not notebook:
        return ({"error": "Notebook not found"}, 404)
    db.remove_notebook(notebook.id)
    return { "notebook": notebook.to_dict() }


print('hello its kk')