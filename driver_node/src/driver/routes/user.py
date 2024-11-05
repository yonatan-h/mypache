from flask import Blueprint
from driver.utils import random_id
from driver.middlewares import get_user
from driver.db import db
from driver.models.user import User

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




