from flask import Blueprint
from flaskr.utils import random_id
from flaskr.middlewares import get_user
from flaskr.db import db
from flaskr.models.user import User

bp = Blueprint('users', __name__, url_prefix='/users')

@bp.post('/session')
def login_ish():
    token = random_id()
    db.add_user(User(id=token)) 
    return {"token":token}

@bp.get('/me')
def get_me():
    try:
        user = get_user()
    except Exception as e:
        return {"error":str(e)},401

    return {"user":user.to_dict()}




