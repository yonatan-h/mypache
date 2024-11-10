from notebook import Notebook
from driver.models.user import User
from driver.models.file import File
from driver.models.worker import Worker
from driver.models.cluster import Cluster, ClusterRuntime



class DB:
    _users: list[User] = [User(id="1")]
    _workers: list[Worker] = []
    _clusters: list[Cluster] = []
    _clusterRuntimes: list[ClusterRuntime] = [
        ClusterRuntime(id="1", name="1.0 LTS", lang="Python 3.14", )
    ]
    _files: list[File] = [File(id="1",filename="default.csv", user_id="1")]

    _notebooks: list[Notebook] = [ ]


    def get_notebooks(self, user_id:str="")->list[Notebook]:
        if user_id: 
            return [n for n in self._notebooks if n.user.id == user_id]
        return self._notebooks

    def add_notebook(self, notebook:Notebook):
        self._notebooks.append(notebook)

    def remove_notebook(self, id:str, user_id:str):
        notebook = self.find_notebook(id=id, user_id=user_id)
        if notebook:
            self._notebooks.remove(notebook)
        else:
            raise ValueError(f"Notebook with id {id} not found")
        
    
    def find_notebook(self,id:str, user_id:str)->Notebook|None:
        for notebook in self._notebooks:
            if notebook.id == id:
                if notebook.user.id != user_id:
                    raise Exception("Notebook not owned by user")
                return notebook
        return None
    
    def has_user(self, token:str)->bool:
        for user in self._users:
            if user.id == token:
                return True
        return False

    def get_user(self, token:str)->User:
        for user in self._users:
            if user.id == token:
                return user
        raise Exception(f"User with token {token} not found")
    
    def add_user(self, user:User):
        self._users.append(user)
    
    def has_worker(self, address:str)->bool:
        for worker in self._workers:
            if worker.address == address:
                return True
        return False

    def add_worker(self, worker:Worker):
        if worker.address in [w.address for w in self._workers]:
            raise Exception(f"Worker with ip {worker.address} already exists")
        self._workers.append(worker)

    def get_busy_and_idle_workers(self)->tuple[list[Worker],list[Worker]]:
        busies:list[Worker] = []
        idles:list[Worker] = []

        for worker in self._workers:
            in_cluster = False
            #Todo: decrease time complexity
            for cluster in self._clusters:
                if worker in cluster.workers:
                    in_cluster = True
                    break
            if in_cluster:
                busies.append(worker)
            else:
                idles.append(worker)

        return (busies, idles)

    def get_cluster_runtimes(self)->list[ClusterRuntime]:
        return self._clusterRuntimes
    
    def create_cluster(self, num_workers:int, user_id:str, name:str, runtime_id:str, id:str = "")->Cluster:
        if not self.get_user(user_id):
            raise Exception(f"User with id {user_id} not found")
        
        runtime:ClusterRuntime|None =None
        for r in self.get_cluster_runtimes():
            if r.id == runtime_id:
                runtime = r
                break

        if not runtime:
            raise Exception(f"Runtime with id {runtime_id} not found")

        if runtime_id not in [r.id for r in self._clusterRuntimes]:
            raise Exception(f"Runtime with id {runtime_id} not found")
        
        _, idles = self.get_busy_and_idle_workers()
        if len(idles) < num_workers:
            raise Exception(f"Only {len(idles)} workers available")
        cluster = Cluster(name=name, workers=idles, user_id=user_id, runtime=runtime, id=id) 
        self._clusters.append(cluster)
        return cluster
    
    def get_clusters(self, user_id:str="")->list[Cluster]:
        if not user_id:
            return self._clusters
        return [c for c in self._clusters if c.user_id == user_id]

    def get_cluster(self, cluster_id:str, user_id:str)->Cluster:
        for cluster in self._clusters:
            if cluster.id == cluster_id:
                if cluster.user_id != user_id:
                    raise Exception("Cluster not owned by user")
                return cluster
        raise Exception(f"Cluster with id {cluster_id} not found")
    
    def add_file(self, file:File):
        self._files.append(file)
    
    def get_files(self, user_id:str="")->list[File]:
        if not user_id:
            return self._files
        
        files:list[File] = []
        for file in self._files:
            if file.user_id == user_id:
                files.append(file)

        return files
    
 

    def get_file(self, file_id:str, user_id:str|None=None)->File:
        for file in self._files:
            if file.id == file_id:
                if user_id !=None and file.user_id != user_id:
                    raise Exception("File not owned by user")
                return file

        raise Exception(f"File with id {file_id} not found")


db = DB()


