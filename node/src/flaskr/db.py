from notebook import Notebook
from flaskr.models.user import User
from flaskr.models.file import File



class DB:
    _notebooks: list[Notebook] = [
        Notebook(user_id="1", file_id="file1", cluster_id="cluster1",id="1")
    ]
    _users: list[User] = [User(id="1")]
    _files: list[File] = [File(id="1",filename="file1")]

    def get_notebooks(self, user_id:str="")->list[Notebook]:
        if user_id: 
            return [n for n in self._notebooks if n.user_id == user_id]
        return self._notebooks

    def add_notebook(self, notebook:Notebook):
        self._notebooks.append(notebook)

    def remove_notebook(self, id:str):
        notebook = self.find_notebook(id)
        if notebook:
            self._notebooks.remove(notebook)
        else:
            raise ValueError(f"Notebook with id {id} not found")
        
    
    def find_notebook(self,id:str)->Notebook|None:
        for notebook in self._notebooks:
            if notebook.id == id:
                return notebook
        return None
    
    def has_user(self, token:str)->bool:
        for user in self._users:
            if user.id == token:
                return True
        return False

    def get_user(self, token:str)->User:
        print(self._users, flush=True)
        for user in self._users:
            if user.id == token:
                return user
        raise Exception(f"User with token {token} not found")
    
    def add_user(self, user:User):
        self._users.append(user)

db = DB()


