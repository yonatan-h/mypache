from flask import Blueprint, request
from werkzeug.datastructures import FileStorage
from flaskr.models.file import allowed_extensions, File
from flaskr.db import db
from flaskr.middlewares import get_user
from flaskr.utils import random_id

bp = Blueprint('files', __name__, url_prefix='/files')

@bp.post('')
def upload_file():
    try:    
        user = get_user()
    except Exception as e:
        return {"error":str(e)},401

    target_name:str|None =  request.form.get('targetName')
    if not target_name:
        return {"error":"No target File Name provided"},400

    if 'file' not in request.files:
        return {"error":"No file part"},400

    file:FileStorage = request.files['file']
    if not file.filename:
        return {"error":"No file was sent"},400
    
    extension = file.filename.split('.')[-1]
    if extension not in allowed_extensions:
        return {"error":f"Invalid file type. Only {allowed_extensions} are allowed"},400
    
    if target_name in [f.filename for f in db.get_files()]: 
        return {"error":f"File with name {target_name} already"},409
    
    try:
        file.save(f"/tmp/{target_name}.{extension}")
    except Exception as e:
        return {"error":str(e)},500

    
    new_file = File(filename=f"{target_name}.{extension}", user_id=user.id)
    db.add_file(new_file)
    
    return {"file":new_file.to_dict()},200
    

@bp.get('')
def get_files():
    try:    
        user = get_user()
    except Exception as e:
        return {"error":str(e)},401

    files = db.get_files(user_id=user.id)
    print("files areeeee",files, flush=True)
    return {"files":[f.to_dict() for f in files]},200
    
@bp.get('/<id>/sliced/<parts>/<part>')
def get_slice(id:str, parts:int, part:int):
    try:    
        user = get_user()
    except Exception as e:
        return {"error":str(e)},401

    try:
        file = db.get_file(file_id=id, user_id=user.id)
    except Exception as e:
        return {"error":str(e)},404
    
    #Todo: improve
    content:str = ""
    with open(f"/tmp/{file.filename}") as original_file:
        print(original_file, flush=True)
        content = original_file.read()
    
    sliced_name = random_id()
    #-1 to remove cols
    part_len = (len(content)-1)//parts
    with open(f"/tmp/{sliced_name}", 'w') as sliced_file:
        from_ind = part*part_len
        to_ind = (part+1)*part_len
        if part == parts-1: to_ind = len(content)

        sliced_file.write(content[from_ind: to_ind])
    

    return {"fileName":sliced_name}




