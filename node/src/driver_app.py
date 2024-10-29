from flask import Flask, request
from notebook import Notebook, Cell
app = Flask(__name__)

#small db
#Todo: remove existing id
notebooks:list[Notebook] = [
    Notebook(file_id="file1", cluster_id="cluster1",id="1"),
]
def find_notebook(id:str)->Notebook|None:
    for notebook in notebooks:
        if notebook.id == id:
            return notebook
    return None


@app.get("/")
def say_hello():
    return "Hello World!"

@app.get('/notebooks')
def get_notebooks():
    return {
        "notebooks": [notebook.to_dict() for notebook in notebooks]
    }

@app.get('/notebooks/<id>')
def get_notebook(id:str):
    notebook = find_notebook(id)
    if not notebook:
        return ({"error": "Notebook not found"}, 404)
    return { "notebook": notebook.to_dict() }

@app.put('/notebooks/<id>/run/<index>')
def run_cell(id:str, index:str):
    print('before2--', flush=True)
    notebook = find_notebook(id)
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

@app.post('/notebooks')
def create_notebook():
    request_data = request.get_json() #{fileId:str, clusterId:str}
    notebook =Notebook(file_id=request_data.get("fileId"), cluster_id=request_data.get("clusterId"))
    #Todo: remove hard coded id
    notebooks.append(notebook)
    return { "notebook": notebook.to_dict() }

@app.delete('/notebooks/<id>')
def delete_notebook(id:str):
    notebook = find_notebook(id)
    if not notebook:
        return ({"error": "Notebook not found"}, 404)
    notebooks.remove(notebook)
    return { "notebook": notebook.to_dict() }


