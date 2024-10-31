
from flask import request
from flaskr.db import db

#Todo: replace by middleware
def get_user():
    auth = request.headers.get("Authorization")
    if not auth:
        raise Exception("No token provided")
    
    token = auth.split(" ")[1]
    if not db.has_user(token):
        raise Exception("User not found")
    
    return db.get_user(token)

        