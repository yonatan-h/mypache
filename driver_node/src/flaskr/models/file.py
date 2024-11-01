from flaskr.utils import random_id

allowed_extensions = ["csv"]

class File:
    id: str
    filename: str
    user_id: str

    def __init__(self, filename:str, id:str="", user_id:str=""):
        self.filename = filename
        self.user_id = user_id
        if not id: self.id = random_id()

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "user_id": self.user_id
        }

