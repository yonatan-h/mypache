from flask import Blueprint, request
from werkzeug.datastructures import FileStorage
from driver.models.file import allowed_extensions, File
from driver.db import db
from driver.middlewares import get_user
from driver.utils import random_id
from flask import send_from_directory

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
    return {"files":[f.to_dict() for f in files]},200
    
@bp.get('/<id>/sliced/<parts>/<part>')
def get_slice(id:str, parts:int, part:int):
    parts = int(parts)
    part = int(part)

    #Todo: authenticate worker server
    # try:    
    #     user = get_user()
    # except Exception as e:
    #     return {"error":str(e)},401

    try:
        file = db.get_file(file_id=id)
    except Exception as e:
        return {"error":str(e)},404
    
    #Todo: improve
    content:list[str] = []
    with open(f"/tmp/{file.filename}") as original_file:
        print(original_file, flush=True)
        content = original_file.readlines()
    
    sliced_name = random_id()
    #-1 to remove cols
    part_len = (len(content)-1)//parts
    with open(f"/tmp/{sliced_name}", 'w') as sliced_file:
        from_ind = part*part_len
        to_ind = (part+1)*part_len

        #never lose the last row
        if part == parts-1: to_ind = len(content)
        #lost the column names
        if from_ind == 0: from_ind += 1

        sliced_file.write("".join(content[from_ind: to_ind]))
    
    return send_from_directory('/tmp', sliced_name)



    



