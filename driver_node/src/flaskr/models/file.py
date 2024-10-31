from flaskr.utils import random_id

class File:
    id: str
    filename: str

    def __init__(self, filename:str, id:str=""):
        self.filename = filename
        if not id:
            self.id = random_id()
    def to_dict(self):
        return {
            "filename": self.filename
        }

